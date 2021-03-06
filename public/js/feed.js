const cdn = "https://dhpd030vnpk29.cloudfront.net/truman-objections";
const viewCount = {
    3000: 7, // 0: 3 seconds
    10000: 8, // 1: 10 seconds
    15000: 9, // 2: 15 seconds
    20000: 8, // 3: 20 seconds
    40000: 7, // 4: 40 seconds
    60000: 6, // 5: 60 seconds
    75000: 7, // 6: 75 seconds
    80000: 5, // 7: 80 seconds
    83000: 6, // 8: 83 seconds
    90000: 7, // 9: 90 seconds
    97000: 8, // 10: 97 seconds
    100000: 7, // 11: 100 seconds
    140000: 6, // 12: 140 seconds
    180000: 5, // 13: 180 seconds
    200000: 6, // 14: 200 seconds
}

const times = Object.keys(viewCount);
const counts = Object.values(viewCount);
const length = counts.length;

const r_id = searchParams.get("r_id");

$(window).on("load", async function() {
    await $.when(
            $.getJSON('/public/jsons/actor_profiles.json'),
            $.getJSON('/public/jsons/offense_messages.json'),
            $.getJSON('/public/jsons/objection_messages.json'))
        .done(function(actorData, offenseMessageData, objectionMessageData) {
            actorData = actorData[0];
            offenseMessageData = offenseMessageData[0];
            objectionMessageData = objectionMessageData[0];

            const offense = ["misinformation", "harassment", "hate_speech"][off_id];
            const actors = actorData[offense];
            for (const actor of actors) {
                const element_id = actor["id"];

                // ----- Future actor -----
                if (element_id === "#actor5") {
                    $("#actor5 img.popupNotificationImage").attr("src", cdn + actor["src"]);
                    $("#actor5 .label").css("background-color", actor["color"]);
                    $("#actor5 span.author").html(actor["name"] + " ");
                    $("#actor5 span.text").html(actor["message"]);

                    setTimeout(function() {
                        const mess =
                            `<div class="comment incomingComment hidden" id="actor5">
                                <div class="image" style="background-color:${actor["color"]}">
                                    <a class="avatar"> 
                                        <img src=${cdn + actor["src"]}> 
                                    </a>
                                </div>
                                <div class="content">
                                    <a class="author">${actor["name"]}</a>
                                <div class="metadata">
                                    <span class="date">${actor["time"]}</span>
                                </div>
                                <div class="text">${actor["message"]}</div>
                                <div class="actions">
                                    <a class="upvote" onClick="likeComment(event)">
                                        <i class="icon thumbs up"/>
                                        <span class="num">${actor["likes"]}</span>
                                    </a>
                                    <a class="downvote" onClick="dislikeComment(event)">
                                        <i class="icon thumbs down"/>
                                        <span class="num">${actor["dislikes"]}</span>
                                    </a>
                                    <a class="reply" onClick="openCommentReply(event)">
                                        Reply
                                    </a>
                                    <a class="flag" onClick="flagComment(event)">
                                        Flag
                                    </a>
                                    <a class="share" onClick="shareComment(event)">
                                        Share
                                    </a>
                                </div>
                            </div>
                        </div>`;

                        $(".ui.comments").prepend(mess);
                        $(".incomingComment").transition('slide down').transition('glow');

                        // if in a mobile view, put popup in the middle
                        // TO DO: mobile + desktop popup
                        $("#desktopPopup").show();
                        $("#desktopPopup").transition("pulse");

                        setTimeout(function() {
                            if ($("#desktopPopup").is(':visible')) {
                                $("#desktopPopup").transition("fade");
                            }
                        }, 5000);
                    }, (20000));
                    continue;
                }

                // ----- Existing actors -----
                const comment_element = $(`.comment${element_id}`);
                // Change Profile Picture
                comment_element.find('.image a.avatar img').attr("src", cdn + actor["src"]);
                comment_element.find('.image').css("background-color", actor["color"]);
                // Change Name
                comment_element.find('.content a.author').html(actor["name"]);
                // Change Time
                comment_element.find('.content .metadata span.date').html(actor["time"]);
                // Change Likes/ Dislikes
                comment_element.find('.content .actions a.upvote span.num').html(actor["likes"]);
                comment_element.find('.content .actions a.downvote span.num').html(actor["dislikes"]);
                // Add message
                comment_element.find('.content .text').html(actor["message"]);
            }
            $("#offense").html(offenseMessageData[offense]);
            if (obj_t_id === "none") {
                $("#actor3").parent().remove();
            } else {
                $("#objection").html(objectionMessageData[offense][obj_t_id][obj_m_id].replace(/\n/g, "<br />"));
            }
        });

    // Close notification
    $('.message .close').on('click', function() {
        $(this)
            .closest('.message')
            .transition('fade');
    });

    // scroll to appropriate post when notification popup is clicked
    $('.notificationPopup').on('click', function(event) {
        if ($(event.target).hasClass('close')) {
            return false;
        }
        $(".incomingComment")[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    });

    // Update view count
    for (var i = 0; i < times.length * 20; i++) {
        (function(ind) {
            const mult = Math.floor(ind / length); // 0, 1, 2, 3, etc. 
            const num = ind % length; // 0, 1, 2, 3, etc.
            setTimeout(function() {
                // console.log(((200000 * mult) + parseInt(times[num])) / 1000);
                $(".viewCount").transition('slide up').text(" " + counts[num] + " ").css("color", "red").transition('slide up').transition('glow');
                setTimeout(function() {
                    $(".viewCount").css("color", "rgba(0,0,0,.68)")
                }, 1200);
            }, (200000 * mult) + parseInt(times[num]));
        })(i);
    }
});