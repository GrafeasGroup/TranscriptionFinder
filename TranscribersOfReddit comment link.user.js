(() => {

    // ==UserScript==
    // @name     Transcript Available?
    // @version  0.1.0
    // @grant    none
    // @match    https://*.reddit.com/r/*
    // @author   Mr_Transcriber
    // @run-at   document-end
    // ==/UserScript==

    if (location.pathname.substr(0, 3) !== '/r/') return;

    if (['casualuk', 'programmerhumor', 'quityourbullshit', 'antimlm'].indexOf(location.pathname.split `/` [2].toLowerCase()) === -1) return;

    var siteTable = document.getElementById`siteTable`;

    if (!(siteTable && siteTable.getAttribute('class').indexOf('linklisting') > -1)) return;

    var listOfIds = [];

    Array.prototype.forEach.call(siteTable.childNodes, (element) => {

        if (element.id.substr(0, 9) !== 'thing_t3_') return;

        if (element.getAttribute('class').indexOf('self') > -1) return;


        var submissionId = element.id.replace('thing_t3_', '');

        ((submissionId) => {

            //Right, now let me fetch comments and check for transcript
            fetch('https://' + location.host + '/' + submissionId + '.json?limit=999999').then(resp => resp.json().then(submission => {
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

                    if (comment.data.body.indexOf("^^I'm&amp;#32;a&amp;#32;human&amp;#32;volunteer&amp;#32;content&amp;#32;transcriber&amp;#32;for&amp;#32;Reddit&amp;#32;and&amp;#32;you&amp;#32;could&amp;#32;be&amp;#32;too!&amp;#32;[If&amp;#32;you'd&amp;#32;like&amp;#32;more&amp;#32;information&amp;#32;on&amp;#32;what&amp;#32;we&amp;#32;do&amp;#32;and&amp;#32;why&amp;#32;we&amp;#32;do&amp;#32;it,&amp;#32;click&amp;#32;here!](https://www.reddit.com/r/TranscribersOfReddit/wiki/index)") > -1) {
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