//		botsi
var reg_br_in = new RegExp('<br/>', 'g');

var reg_br_out = new RegExp('\n', 'g');

var jsoneditor;

// my starting schema

var myschema = {
    "type": "object",
    "options": {
        "disable_edit_json": true,
        "disable_collapse": true,
        "disable_properties": true
    },
    "properties": {
        "name": {
            "title": "Projekt Name",
            "description": "Name as writen on Page",
            "type": "string",
            "minLength": 4,
            "default": "Neue Arbeit"
        },
        "comp_name": {
            "title": "Name für Computer",
            "description": "lowercase no whitespace or special characters",
            "type": "string",
            "minLength": 4,
            "default": "neuearbeit"
        },
        "search": {
            "title": "Schlagwörter",
            "options": {
                "disable_array_reorder": true
            },
            "type": "array",
            "format": "table",
            "items": {
                "type": "string"
            },
            "default": []
        },
        "time": {
            "options": {
                "disable_edit_json": true,
                "disable_properties": true
            },
            "type": "object",
            "format": "grid",
            "properties": {

                "from": {
                    "options": {
                        "disable_edit_json": true,
                        "disable_collapse": true,
                        "disable_properties": true
                    },
                    "type": "object",
                    "format": "table",
                    "properties": {
                        "day": {
                            "type": "integer",
                            "enum": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12,
                                13,
                                14,
                                15,
                                16,
                                17,
                                18,
                                19,
                                20,
                                21,
                                22,
                                23,
                                24,
                                25,
                                26,
                                27,
                                28,
                                29,
                                30,
                                31
                            ],
                            "default": 1
                        },
                        "month": {
                            "type": "integer",
                            "enum": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12
                            ],
                            "default": 1
                        },
                        "year": {
                            "type": "integer",
                            "enum": [
                                2000,
                                2001,
                                2002,
                                2003,
                                2004,
                                2005,
                                2006,
                                2007,
                                2008,
                                2009,
                                2010,
                                2011,
                                2012,
                                2013,
                                2014,
                                2015,
                                2016,
                                2017,
                                2018
                            ],
                            "default": 2000
                        },
                        "date": {
                            "type": "string",
                            "template": "{{day}},{{month}},{{year}}",
                            "watch": {
                                "day": "time.from.day",
                                "month": "time.from.month",
                                "year": "time.from.year"
                            }
                        }
                    }
                },
                "till": {
                    "options": {
                        "disable_edit_json": true,
                        "disable_collapse": true,
                        "disable_properties": true
                    },
                    "type": "object",
                    "format": "table",
                    "properties": {
                        "day": {
                            "type": "integer",
                            "enum": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12,
                                13,
                                14,
                                15,
                                16,
                                17,
                                18,
                                19,
                                20,
                                21,
                                22,
                                23,
                                24,
                                25,
                                26,
                                27,
                                28,
                                29,
                                30,
                                31
                            ],
                            "default": 1
                        },
                        "month": {
                            "type": "integer",
                            "enum": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                10,
                                11,
                                12
                            ],
                            "default": 1
                        },
                        "year": {
                            "type": "integer",
                            "enum": [
                                2000,
                                2001,
                                2002,
                                2003,
                                2004,
                                2005,
                                2006,
                                2007,
                                2008,
                                2009,
                                2010,
                                2011,
                                2012,
                                2013,
                                2014,
                                2015,
                                2016,
                                2017,
                                2018
                            ],
                            "default": 2000
                        },
                        "date": {
                            "type": "string",
                            "template": "{{day}},{{month}},{{year}}",
                            "watch": {
                                "day": "time.till.day",
                                "month": "time.till.month",
                                "year": "time.till.year"
                            }
                        }
                    }
                }

            }
        },
        "published": {
            "options": {
                "disable_edit_json": true,
                "disable_collapse": true,
                "disable_properties": true
            },
            "type": "object",
            "format": "table",
            "properties": {
                "year": {
                    "type": "integer",
                    "enum": [
                        2000,
                        2001,
                        2002,
                        2003,
                        2004,
                        2005,
                        2006,
                        2007,
                        2008,
                        2009,
                        2010,
                        2011,
                        2012,
                        2013,
                        2014,
                        2015,
                        2016,
                        2017,
                        2018
                    ],
                    "default": 2000
                },
                "at": {
                    "type": "string"
                }
            }
        },

        "prolog": {
            "type": "string",
            "format": "html",
            "options": {
                "wysiwyg": true
            },
            "default": "text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text"
        },
        "text": {
            "type": "string",
            "format": "html",
            "options": {
                "wysiwyg": true
            },
            "default": "text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, text"
        },
        "epilog": {
            "options": {},
            "type": "object",
            "title": "Epilog",
            "properties": {
                /*
                                "Ausstellungskonzept": {
                                    "type": "string",
                                    "default": "text, text, text"
                                },
                */
                "Ausstellungsort": {
                    "type": "string",
                    "description": "This is generated automatically from the previous fields",
                    "template": "{{haus}}<br/>{{strasse_nr}}<br/>{{plz_ort}}<br/>{{land}}<br/>{{url}}",
                    "watch": {
                        "haus": "epilog.haus",
                        "strasse_nr": "epilog.strasse_nr",
                        "plz_ort": "epilog.plz_ort",
                        "land": "epilog.land",
                        "url": "epilog.url"
                    }
                },
                "haus": {
                    "type": "string",
                    "default": "Haus der Qufaktur"
                },
                "strasse_nr": {
                    "type": "string",
                    "default": "Musterweg 99"
                },
                "plz_ort": {
                    "type": "string",
                    "default": "1234 Beispielingen"
                },
                "land": {
                    "type": "string",
                    "default": "Togo"
                },
                "url": {
                    "type": "string",
                    "default": "www.palma3.ch"
                }
            }
        }
    }
};

function loadXMLDoc(url, cfunc, val) {

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = cfunc;

    if (url.search('new_e') != -1) {

        xmlhttp.open("POST", url, true);

        xmlhttp.setRequestHeader("expires", "0");

        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xmlhttp.send(val);

    } else {

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

    }

}
