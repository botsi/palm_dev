			//Uses the https://github.com/github-tools/github library under the hood and exposes it as `gh` property
			function GithubAPI(auth) {
				let repo;
				let filesToCommit = [];
				let currentBranch = {};
				let newCommit = {};
				console.log('hi');
				//the underlying library for making requests
				let gh = new GitHub(auth);

				/**
				 * Sets the current repository to make push to
				 * @public
				 * @param {string} userName Name of the user who owns the repository
				 * @param {string} repoName Name of the repository
				 * @return void
				 */
				this.setRepo = function(userName, repoName) {
					repo = gh.getRepo(userName, repoName);
				}

				/**
				 * Sets the current branch to make push to. If the branch doesn't exist yet,
				 * it will be created first
				 * @public
				 * @param {string} branchName The name of the branch
				 * @return {Promise}
				 */
				this.setBranch = function(branchName) {
					if (!repo) {
						throw 'Repository is not initialized';
					}

					return repo.listBranches().then((branches) => {

						let branchExists = branches.data.find(branch => branch.name === branchName);

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

				/**
				 * Makes the push to the currently set branch
				 * @public
				 * @param  {string}   message Message of the commit
				 * @param  {object[]} files   Array of objects (with keys 'content' and 'path'),
				 *                            containing data to push
				 * @return {Promise}
				 */
				this.pushFiles = function(message, files) {
					if (!repo) {
						throw 'Repository is not initialized';
					}
					if (!currentBranch.hasOwnProperty('name')) {
						throw 'Branch is not set';
					}

					/*    //org   */
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

				/**
				 * Sets the current commit's SHA
				 * @private
				 * @return {Promise}
				 */
				function getCurrentCommitSHA() {
					return repo.getRef('heads/' + currentBranch.name)
						.then((ref) => {
							currentBranch.commitSHA = ref.data.object.sha;
						});
				}

				/**
				 * Sets the current commit tree's SHA
				 * @private
				 * @return {Promise}
				 */
				function getCurrentTreeSHA() {
					return repo.getCommit(currentBranch.commitSHA)
						.then((commit) => {
							currentBranch.treeSHA = commit.data.tree.sha;
						});
				}

				/**
				 * Creates blobs for all passed files
				 * @private
				 * @param  {object[]} filesInfo Array of objects (with keys 'content' and 'path'),
				 *                              containing data to push
				 * @return {Promise}
				 */
				function createFiles(filesInfo) {
					let promises = [];
					let length = filesInfo.length;

					for (let i = 0; i < length; i++) {
						promises.push(createFile(filesInfo[i]));
					}

					return Promise.all(promises);
				}

				/**
				 * Creates a blob for a single file
				 * @private
				 * @param  {object} fileInfo Array of objects (with keys 'content' and 'path'),
				 *                           containing data to push
				 * @return {Promise}
				 */


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

				/**
				 * Creates a new tree
				 * @private
				 * @return {Promise}
				 */
				function createTree() {
					return repo.createTree(filesToCommit, currentBranch.treeSHA)
						.then((tree) => {
							newCommit.treeSHA = tree.data.sha;
						});
				}

				/**
				 * Creates a new commit
				 * @private
				 * @param  {string} message A message for the commit
				 * @return {Promise}
				 */
				function createCommit(message) {
					return repo.commit(currentBranch.commitSHA, newCommit.treeSHA, message)
						.then((commit) => {
							newCommit.sha = commit.data.sha;
						});
				}

				/**
				 * Updates the pointer of the current branch to point the newly created commit
				 * @private
				 * @return {Promise}
				 */
				function updateHead() {
					return repo.updateHead('heads/' + currentBranch.name, newCommit.sha);
				}
			};



			var up_git = function(u, nt, n, r, b, t, f) {

				let d = new Date();

				function addZero(i) {
					if (i < 10) {
						i = "0" + i;
					}
					return i;
				}

				let h = addZero(d.getHours());
				let m = addZero(d.getMinutes());
				let s = addZero(d.getSeconds());

				let post_commit = 'Anpassung von: ' + u + ' am: ' + d.getDate() + '. ' + adjustments_de.monthNamesMin[d.getMonth()] + ' ' + d.getFullYear() + ' um: ' + h + ":" + m + ":" + s;

				let api = new GithubAPI({
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