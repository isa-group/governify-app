ace.define('ace/theme/soup', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-soup";
exports.cssText = ".ace-soup{\
}\
.ace_at{\
	color: #005672;\
}\
.ace_soup{\
	color: #4545D6;\
}\
.ace_uri{\
	color: #087200;\
}\
.ace_tag{\
	color: #16001B;\
}\
.ace_ptag{\
	color: #64006B;\
}\
.ace_string{\
	color: blue;\
}\
.ace_entity-name-tag.ace_true{\
	color: #20800b;\
}\
.ace_entity-name-tag.ace_false{\
	color: #be361b;\
}\
.ace_comment{\
	color: #45725E;\
}\
.ace_variable.ace_functions.ace_1{\
	color: #DF7401;\
}\
.ace-soup .ace_gutter {\
background: rgba(250, 250, 250, 0.5);\
color: #BDBDBD;\
overflow : visible;\
border-right: 1px solid rgba(0,0,0,0.05);\
}\
.ace-soup .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-soup {\
background-color: #FFFFFF;\
}\
.ace-soup .ace_cursor {\
color: black;\
}\
.ace-soup .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-soup .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-soup .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-soup .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-soup .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-soup .ace_fold {\
}\
.ace-soup .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-soup .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-soup .ace_support.ace_type,\
.ace-soup .ace_support.ace_class\
.ace-soup .ace_support.ace_other {\
color: rgb(109, 121, 222);\
}\
.ace-soup .ace_variable.ace_parameter {\
font-style:italic;\
color:#FD971F;\
}\
.ace-soup .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-soup .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-soup .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-soup .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-soup .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-soup .ace_marker-layer .ace_selection {\
background: rgba(45, 151, 221, 0.29);\
}\
.ace-soup .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-soup .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-soup .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-soup .ace_marker-layer .ace_active-line {\
background: rgba(133, 151, 170, 0.09);\
}\
.ace-soup .ace_gutter-active-line {\
background-color: rgba(66, 66, 66, 0.06);\
border-right: 1px solid rgba(66, 128, 178, 0.19);\
right: -1px;\
}\
.ace-soup .ace_marker-layer .ace_selected-word {\
background: rgba(66, 128, 178, 0.12);\
border-bottom: 1px solid rgba(66, 128, 178, 0.19);\
}\
.ace-soup .ace_storage,\
.ace-soup .ace_meta.ace_tag {\
color: rgb(147, 15, 128);\
}\
.ace-soup .ace_entity.ace_other.ace_attribute-name {\
color: #994409;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
