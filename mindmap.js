var kc = {
  "18": "alt",
  "8": "backspace",
  "20": "caps_lock",
  "188": "comma",
  "91": "command",
  "91": "command_left",
  "93": "command_right",
  "17": "control",
  "46": "delete",
  "40": "down",
  "35": "end",
  "13": "enter",
  "27": "escape",
  "36": "home",
  "45": "insert",
  "37": "left",
  "93": "menu",
  "107": "numpad_add",
  "110": "numpad_decimal",
  "111": "numpad_divide",
  "108": "numpad_enter",
  "106": "numpad_multiply",
  "109": "numpad_subtract",
  "34": "page_down",
  "33": "page_up",
  "190": "period",
  "39": "right",
  "16": "shift",
  "32": "space",
  "9": "tab",
  "38": "up",
  "91": "windows"
};
var template = "<li><span contenteditable='true'><br /></span><ul></ul></li>";
var cmd = {
  "cmd+enter": function() {
    $(template)
      .appendTo($(this)
        .next("ul"))
          .find("[contenteditable]")
          .focus();
    return false;
  },
  "shift+enter": function() {
    if ($(this).parent("li").hasClass("root")) { return false; };

    $(template)
    .insertAfter($(this)
      .parent("li"))
        .find("[contenteditable]")
        .focus();
    return false;
  },
  "backspace": function() {
    var $this = $(this);
    if ($this.parent("li").hasClass("root")) { return true; };

    if (!$this.text()) {
      $this.parent("li").prev("li").find("[contenteditable]").focus();
      $this.parent("li").remove();
    };
  },
  "cmd+backspace": function() {
    if ($(this).parent("li").hasClass("root")) { return false; };
    $(this).parent("li").prev("li").find("[contenteditable]").focus();
    $(this).parent("li").remove();
    return false;
  },
  "cmd+m": function() {
    $("body>ul").toggleClass("mindmap");
    $("body").toggleClass("mindmap-parent");
    return false;
  },
  "cmd+b": function() {
    document.execCommand("bold");
    return false;
  },
  "cmd+u": function() {
    document.execCommand("underline");
    return false;
  },
  "cmd+i": function() {
    document.execCommand("italic");
    return false;
  },
  "ctrl+s": function() {
    localStorage.setItem('mindmap_content', $(".mindmap").html());
    return false;
  },
  "ctrl+l": function() {
    $(".mindmap").html(localStorage.getItem('mindmap_content'));
    return false;
  },
  "ctrl+r": function() {
    $(".mindmap").addClass("rotate");
    return false;
  }
};

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

$(document).ready(function() {
  $(".mindmap").on("keydown", "[contenteditable]", function(e) {
    if ([16, 18, 91, 93, 17].indexOf(e.which) == -1) {
      var mod = [];
      mod.push(e.shiftKey ? "shift" : null,
               e.altKey   ? "alt"   : null,
               e.metaKey  ? "cmd"   : null,
               e.ctrlKey  ? "ctrl"  : null
      );
      var keyString = mod.concat(kc[e.which] || String.fromCharCode(e.which).toLowerCase())
                         .filter(function(e) {return e!=null})
                         .join("+");
      return cmd[keyString] && cmd[keyString].apply(this);
    };
  });

  selectElementContents($("[contenteditable]").focus().select()[0]);

  $(".mindmap").on("click", "ul:empty", function() {
    cmd["cmd+enter"].apply($(this).prev("[contenteditable]")[0]);
  });
});