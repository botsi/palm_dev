function GithubAPI(auth) {
 var repo, filesToCommit = [], currentBranch = {}, newCommit = {}, gh = new GitHub(auth);
this.setRepo = function (userName, repoName) {
 repo = gh.getRepo(userName, repoName);
 }

this.setBranch = function (branchName) {
		if (!repo) {
			throw 'Repository is not initialized';
		}

		return repo.listBranches().then(function (branches){

			branchExists = branches.data.find(branch => branch.name === branchName);

			if (!branchExists) {
				return repo.createBranch('master', branchName)
					.then(function (){
						currentBranch.name = branchName;
					});
			} else {
				currentBranch.name = branchName;
			}
		});
	}

/*

this.setBranch = function (branchName) {
		if (!repo) {
			throw 'Repository is not initialized';
		}

		return repo.listBranches().then((branches) => {

			branchExists = branches.data.find(branch => branch.name === branchName);


			if (!branchExists) {
				return repo.createBranch('master', branchName)
					.then(() => {
						currentBranch.name = branchName;
					});
			} else {
				currentBranch.name = branchName;
			}
		});
	}
*/

	this.pushFiles = function(message, files) {
		if (!repo) {
			throw 'Repository is not initialized';
		}
		if (!currentBranch.hasOwnProperty('name')) {
			throw 'Branch is not set';
		}

		return getCurrentCommitSHA()
			.then(getCurrentTreeSHA)
			.then(() => createFiles(files))
			.then(createTree)
			.then(() => createCommit(message))
			.then(updateHead)
			.catch((e) => {
				console.error(e);
			});

	}

	function getCurrentCommitSHA() {
		return repo.getRef('heads/' + currentBranch.name)
			.then((ref) => {
				currentBranch.commitSHA = ref.data.object.sha;
			});
	}

	function getCurrentTreeSHA() {
		return repo.getCommit(currentBranch.commitSHA)
			.then((commit) => {
				currentBranch.treeSHA = commit.data.tree.sha;
			});
	}

	function createFiles(filesInfo) {
		promises = [];
		length = filesInfo.length;

		for (i = 0; i < length; i++) {
			promises.push(createFile(filesInfo[i]));
		}

		return Promise.all(promises);
	}

	function createFile(fileInfo) {
		return repo.createBlob(fileInfo.content)
			.then((blob) => {
				filesToCommit.push({
					sha: blob.data.sha,
					path: fileInfo.path,
					mode: '100644',
					type: 'blob'
				});
			});
	}

	function createTree() {
		return repo.createTree(filesToCommit, currentBranch.treeSHA)
			.then((tree) => {
				newCommit.treeSHA = tree.data.sha;
			});
	}

	function createCommit(message) {
		return repo.commit(currentBranch.commitSHA, newCommit.treeSHA, message)
			.then((commit) => {
				newCommit.sha = commit.data.sha;
			});
	}

	function updateHead() {
		return repo.updateHead('heads/' + currentBranch.name, newCommit.sha);
	}
};

var up_git = function(u, nt, n, r, b, t, f) {

	if (up_git.length != 7) {
		return;
	}

	d = new Date();

	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	h = addZero(d.getHours());
	m = addZero(d.getMinutes());
	s = addZero(d.getSeconds());

	post_commit = u + ' am: ' + d.getDate() + '. ' + adjustments_de.monthNamesMin[d.getMonth()] + ' ' + d.getFullYear() + ' um: ' + h + ":" + m + ":" + s;

	api = new GithubAPI({
		token: t
	});

	api.setRepo(n, r);
	api.setBranch(b)
		.then(() => api.pushFiles(
			post_commit, [{
				content: nt,
				encoding: 'utf-8',
				path: f
			}]))
		.then(function() {

			document.getElementById('process_overlay').classList.remove('process_overlay_dark');
			document.body.style.background = '#fff';
			document.getElementById('Images_display').style.background = '#ccc';

			console.log('Files committed!');
		});

};