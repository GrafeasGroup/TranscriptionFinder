(() => {

    // ==UserScript==
    // @name        Transcription Finder for Reddit
    // @description Finds Reddit post transcriptions submitted by r/TranscribersOfReddit volunteers and inserts a link to them after  the post title.
    // @version     0.1.0
    // @grant       none
    // @match       https://*.reddit.com/r/*
    // @match       https://*.reddit.com/
    // @match       https://*.reddit.com/?*
    // @author      Mr_Transcriber
    // @run-at      document-end
    // @noframes
    // @license     MIT
    // @namespace   https://grafeas.org
    // ==/UserScript==

    if (location.pathname.substr(0, 3) !== '/r/') return;

    if (['casualuk', 'programmerhumor', 'quityourbullshit', 'antimlm'].indexOf(location.pathname.split `/` [2].toLowerCase()) === -1) return;

    var siteTable = document.getElementById `siteTable`;

    if (!(siteTable && siteTable.getAttribute('class').indexOf('linklisting') > -1)) return;

    var listOfIds = [];

    Array.prototype.forEach.call(siteTable.childNodes, (element) => {

        if (element.id.substr(0, 9) !== 'thing_t3_') return;

        if (element.getAttribute('class').indexOf('self') > -1) return;


        var submissionId = element.id.replace('thing_t3_', '');

        ((submissionId) => {

            //Right, now let me fetch comments and check for transcript
            fetch('https://' + location.host + '/' + submissionId + '.json?limit=999999&raw_json=1').then(resp => resp.json().then(submission => {
                if (!(submission instanceof Array)) {
                    throw new Error("Submission isn't array", comments);
                }

                var comments = submission[1].data.children;

                //Assumes the transcript is in a top-level comment
                comments.forEach(comment => {
                    if (comment.kind !== 't1') {
                        console.warn("Wrong type, should be t1", comment);
                        return;
                    } //Shouldn't happen, but just in case

                    if (comment.data.body.indexOf("^^I'm&#32;a&#32;human&#32;volunteer&#32;content&#32;transcriber&#32;for&#32;Reddit&#32;and&#32;you&#32;could&#32;be&#32;too!&#32;[If&#32;you'd&#32;like&#32;more&#32;information&#32;on&#32;what&#32;we&#32;do&#32;and&#32;why&#32;we&#32;do&#32;it,&#32;click&#32;here!](https://www.reddit.com/r/TranscribersOfReddit/wiki/index)") > -1) {
                        var url = "https://" + location.host + "/r/" + submission[0].data.children[0].data.subreddit + "/comments/" + submissionId + "/_/" + comment.data.id;

                        console.log(url);

                        var linkToComment = document.createElement('a');
                        linkToComment.textContent = 'View Transcript';
                        linkToComment.href = url;

                        var entryTitle = document.getElementById('thing_t3_' + submissionId).querySelector `div.entry div.top-matter p.title`;

                        entryTitle.appendChild(document.createTextNode(" "));
                        entryTitle.appendChild(linkToComment);
                    }
                });


            })).catch(exception => console.error(exception));

        })(submissionId)


    });



})()