function changeColor(e, string = "") {
    let target = $(e.target);
    if (target.val().trim() !== string) {
        target.parents(".ui.form").children('.ui.submit.button').addClass("blue");
    } else {
        target.parents(".ui.form").children('.ui.submit.button').removeClass("blue");
    }
}

// ****** actions on main post *******
function likePost(e) {
    let target = $(e.target).closest('.ui.upvote.button');
    if (target.hasClass("green")) {
        target.removeClass("green");
        const label = target.siblings("a.ui.basic.green.left.pointing.label");
        label.html(function(i, val) { return val * 1 - 1 });
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'liked',
            actionValue: false,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    } else {
        target.addClass("green");
        var label = target.siblings("a.ui.basic.green.left.pointing.label");
        label.html(function(i, val) { return val * 1 + 1 });

        let dislike = $('.ui.downvote.button');
        if (dislike.hasClass("red")) {
            dislike.removeClass("red");
            var label = dislike.siblings("a.ui.basic.red.left.pointing.label");
            label.html(function(i, val) { return val * 1 - 1 });
        }
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'liked',
            actionValue: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    }
};

function dislikePost(e) {
    let target = $(e.target).closest('.ui.downvote.button');
    if (target.hasClass("red")) {
        target.removeClass("red");
        const label = target.siblings("a.ui.basic.red.left.pointing.label");
        label.html(function(i, val) { return val * 1 - 1 });
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'disliked',
            actionValue: false,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    } else {
        target.addClass("red");
        var label = target.siblings("a.ui.basic.red.left.pointing.label");
        label.html(function(i, val) { return val * 1 + 1 });

        let like = $('.ui.upvote.button');
        if (like.hasClass("green")) {
            like.removeClass("green");
            var label = like.siblings("a.ui.basic.green.left.pointing.label");
            label.html(function(i, val) { return val * 1 - 1 });
        }
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'disliked',
            actionValue: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    }
};

function addCommentToVideo(e) {
    const username = user.profile.username;
    const photo = user.profile.photo;
    let target = $(e.target);
    const form = target.parents(".ui.form");
    const text = form.find("textarea.replyToVideo").val();
    if (text.trim() !== "") {
        const mess =
            `<div class="comment" id=${user.numComments+6}>
                <div class="image user_img">
                    <a class="avatar"> 
                        <img src=${photo}> 
                    </a>
                </div>
                <div class="content">
                    <a class="author">${username+" (me)"}</a>
                    <div class="metadata">
                        <span class="date">Just now</span>
                    </div>
                    <div class="text">${text}</div>
                    <div class="actions">
                        <a class="upvote" onClick="likeComment(event)">
                            <i class="icon thumbs up"/>
                            <span class="num">0</span>
                        </a>
                        <a class="downvote" onClick="dislikeComment(event)">
                            <i class="icon thumbs down"/>
                            <span class="num">0</span>
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

        $("textarea.replyToVideo").val("");
        $('.ui.button.replyToVideo').hide();
        $("textarea.replyToVideo").blur();
        $(".ui.comments").prepend(mess);
        $(".ui.comments")[0].scrollIntoView({ block: 'start', behavior: 'smooth' });

        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            // actionType: 'comment',
            new_comment: true,
            comment_body: text,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    } else {
        $("textarea.replyToVideo").focus();
    }
}

function flagPost(e) {
    let target = $(e.target).closest('.ui.flag.button');
    if (target.hasClass("orange")) {
        target.removeClass("orange");
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'flagged',
            actionValue: false,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    } else {
        target.addClass("orange");
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'flagged',
            actionValue: true,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    }
};

function sharePost() {
    const pathname = window.location.href;
    $(".pathname").html(pathname);
    $('.ui.small.shareVideo.modal').modal('show');
    $.post("/feed", {
        off_id: off_id,
        obj_t_id: obj_t_id,
        obj_m_id: obj_m_id,
        r_id: r_id,
        actionType: 'shared',
        actionValue: true,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    }).done(function(json) {
        user = json["updated_user"];
        console.log("done")
    });
};

// ****** actions on comment *******
function likeComment(e) {
    let target = $(e.target).closest('a.upvote').children('i.icon.thumbs.up');
    let commentID = $(e.target).closest(".comment").attr('id').replace('actor', '');
    if (target.hasClass("green")) {
        target.removeClass("green");
        const label = target.siblings("span.num");
        label.html(function(i, val) { return val * 1 - 1 });

        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'liked',
            actionValue: false,
            commentID: commentID,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    } else {
        target.addClass("green");
        var label = target.siblings("span.num");
        label.html(function(i, val) { return val * 1 + 1 });

        let dislike = $(e.target).closest('a.upvote').siblings('a.downvote').children('i.icon.thumbs.down');
        if (dislike.hasClass("red")) {
            dislike.removeClass("red");
            var label = dislike.siblings("span.num");
            label.html(function(i, val) { return val * 1 - 1 });
        }

        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'liked',
            actionValue: true,
            commentID: commentID,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    }
};

function dislikeComment(e) {
    let target = $(e.target).closest('a.downvote').children('i.icon.thumbs.down');
    let commentID = $(e.target).closest(".comment").attr('id').replace('actor', '');
    if (target.hasClass("red")) {
        target.removeClass("red");
        const label = target.siblings("span.num");
        label.html(function(i, val) { return val * 1 - 1 });

        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'disliked',
            actionValue: false,
            commentID: commentID,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    } else {
        target.addClass("red");
        var label = target.siblings("span.num");
        label.html(function(i, val) { return val * 1 + 1 });

        let like = $(e.target).closest('a.downvote').siblings('a.upvote').children('i.icon.thumbs.up');
        if (like.hasClass("green")) {
            like.removeClass("green");
            var label = like.siblings("span.num");
            label.html(function(i, val) { return val * 1 - 1 });
        }

        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            actionType: 'disliked',
            actionValue: true,
            commentID: commentID,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    }
};

function flagComment(e) {
    let commentID = $(e.target).closest(".comment").attr('id').replace('actor', '');
    let target = $(e.target).closest('.comment').find('.text').first();
    target.replaceWith(
        `<div class = 'text'>
            <h5 class='ui inverted header' style='background-color:black;color:white; margin-top: 10px'>
                <span>
                The admins will review this comment further. We are sorry you had this experience.
                </span>
            </h5>
        </div>
        `);

    $.post("/feed", {
        off_id: off_id,
        obj_t_id: obj_t_id,
        obj_m_id: obj_m_id,
        r_id: r_id,
        actionType: 'flagged',
        actionValue: true,
        commentID: commentID,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    }).done(function(json) {
        user = json["updated_user"];
    });
}

function shareComment(e) {
    const pathname = window.location.href;
    $(".pathname").html(pathname + "?c=" + Math.floor(Math.random() * 31) + 50);
    $('.ui.small.shareComment.modal').modal('show');
    let commentID = $(e.target).closest(".comment").attr('id').replace('actor', '');

    $.post("/feed", {
        off_id: off_id,
        obj_t_id: obj_t_id,
        obj_m_id: obj_m_id,
        r_id: r_id,
        actionType: 'shared',
        actionValue: true,
        commentID: commentID,
        _csrf: $('meta[name="csrf-token"]').attr('content')
    }).done(function(json) {
        user = json["updated_user"];
    });
}

function openCommentReply(e) {
    const photo = user.profile.photo;
    let target = $(e.target).parents('.content');
    const reply_to = target.children('a.author').text().replace(" (me)", "");
    const form = target.children('.ui.form');
    if (form.length !== 0) {
        form.hide(function() { $(this).remove(); });
        target[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else {
        let comment_level = target.parents(".comment").length;
        const comment_area = (
            `<div class="ui form">
                <div class="inline field">
                    <div class="image">
                        <img class="ui image rounded" src=${photo}>
                    </div>
                        <textarea class="replyToComment" type="text" placeholder="Add a Reply..." rows="1" onInput="changeColor(event${comment_level==2 ? ", '@"+reply_to +"'": ""})">${(comment_level == 2) ? "@"+reply_to+" " : ""}</textarea>
                </div>
                <div class="ui submit button replyToComment" onClick="addCommentToComment(event)">
                    Reply to ${reply_to}
                </div>
                <div class="ui cancel basic blue button replyToComment" onClick="openCommentReply(event)">
                    Cancel
                </div>
            </div>
            </form>`
        );
        $(comment_area).insertAfter(target.children('.actions')).hide().show(400);
        const comment_area_element = $(target).find('textarea.replyToComment');
        const end = comment_area_element.val().length;
        comment_area_element[0].setSelectionRange(end, end);
        if (comment_level == 2) {
            comment_area_element.highlightWithinTextarea({
                highlight: [{
                        highlight: "@" + reply_to, // string, regexp, array, function, or custom object
                        className: 'blue'
                    },
                    {
                        highlight: "@" + reply_to.split(" ")[0], // string, regexp, array, function, or custom object
                        className: 'blue'
                    }
                ]
            })
        };
        comment_area_element.focus();
        comment_area_element[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
}

function addCommentToComment(e) {
    const username = user.profile.username;
    const photo = user.profile.photo;
    let target = $(e.target);
    const form = target.parents(".ui.form");
    if (!form.children(".ui.submit.button").hasClass("blue")) {
        return;
    }
    let text = form.find("textarea.replyToComment").val();
    let orig_comment = form.closest(".comment");
    let comment_level = form.parents(".comment").length; // = 1 if 1st level, = 2 if 2nd level
    if (comment_level == 1) {
        if (!orig_comment.children('.comments').length) {
            orig_comment.append('<div class="comments">');
        }
        comments = orig_comment.find(".comments");
    } else {
        comments = orig_comment.closest(".comments");
    }
    if (text.trim() !== "") {
        const words = form.find("mark").map(function() {
            return $(this).html();
        })
        const highlights = [...new Set(words)].sort(function(a, b) {
            return b.length - a.length; // Desc order
        });
        if (highlights.length !== 0) {
            for (word of highlights) {
                var regEx = new RegExp('(?<!<a>)' + word, 'gmi');
                text = text.replace(regEx, '<a>' + word + '</a>')
            }
        }
        const mess =
            `<div class="comment" id=${user.numComments+6}>
                <div class="image user_img">
                    <a class="avatar"> 
                        <img src=${photo}> 
                    </a>
                </div>
                <div class="content">
                    <a class="author">${username+" (me)"}</a>
                    <div class="metadata">
                        <span class="date">Just now</span>
                    </div>
                    <div class="text">${text}</div>
                    <div class="actions">
                        <a class="upvote" onClick="likeComment(event)">
                            <i class="icon thumbs up"/>
                            <span class="num">0</span>
                        </a>
                        <a class="downvote" onClick="dislikeComment(event)">
                            <i class="icon thumbs down"/>
                            <span class="num">0</span>
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

        form.find("textarea.newComment").val("");
        form.remove();
        comments.append(mess);
        $(comments).last()[0].scrollIntoView({ block: 'start', behavior: 'smooth' });

        const reply_to = orig_comment.attr('id').replace('actor', '');
        $.post("/feed", {
            off_id: off_id,
            obj_t_id: obj_t_id,
            obj_m_id: obj_m_id,
            r_id: r_id,
            // actionType: 'comment',
            new_comment: true,
            comment_body: text,
            reply_to: reply_to,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        }).done(function(json) {
            user = json["updated_user"];
        });
    }
}

$(window).on("load", function() {
    // like POST
    $('.upvote.button').click(likePost);

    // dislike POST
    $('.downvote.button').click(dislikePost);

    // Focuses cursor to new comment input field, if the "Reply" button is clicked
    $(".reply.button").click(function() {
        $("textarea.replyToVideo").focus();
    });

    // Open "Cancel" and "Comment" Buttons (to main video)
    $('textarea[name="replyToVideo"]').focusin(function() {
        if ($('.ui.button.replyToVideo').is(":hidden")) {
            $('.ui.button.replyToVideo').show(300);
        }
    });

    // Hide "Cancel" and "Comment" Buttons (to main video)
    $('.ui.cancel.button.replyToVideo').click(function() {
        if ($('.ui.button.replyToVideo').is(":visible")) {
            $('textarea.replyToVideo').val("");
            $('.ui.submit.button.replyToVideo').removeClass("blue");
            $('.ui.button.replyToVideo').hide(300);
        }
    })

    // reply to POST
    $('.ui.submit.button.replyToVideo').click(addCommentToVideo);

    // flag POST
    $('.flag.button').click(flagPost);

    // share POST
    $('.share.button').click(sharePost);

    // like COMMENT
    $("a.upvote").click(likeComment);

    // dislike COMMENT
    $("a.downvote").click(dislikeComment);

    // flag COMMENT
    $("a.flag").click(flagComment);

    // share COMMENT
    $("a.share").click(shareComment);

    // Open comment reply box 
    $("a.reply").click(openCommentReply);

    // add a new Comment
    $(".ui.blue.labeled.submit.icon.button").click(addCommentToComment);

    // When textarea input changes
    $('textarea').on('input', changeColor);

    // Press enter to submit a comment
    window.addEventListener("keydown", function(event) {
        if (!event.ctrlKey && event.key === "Enter" && $(event.target).hasClass("replyToVideo")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            addCommentToVideo(event);
        } else if (!event.ctrlKey && event.key === "Enter" && $(event.target).hasClass("replyToComment")) {
            event.preventDefault();
            event.stopImmediatePropagation();
            addCommentToComment(event);
        }
    }, true);
});