ace.define('ace/theme/lusdl', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-lusdl";
exports.cssText = ".ace-lusdl{\
}\
.ace_at{\
	color: #005672;\
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
.ace-lusdl .ace_gutter {\
background: rgba(250, 250, 250, 0.5);\
color: #BDBDBD;\
overflow : visible;\
border-right: 1px solid rgba(0,0,0,0.05);\
}\
.ace-lusdl .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-lusdl {\
background-color: #FFFFFF;\
}\
.ace-lusdl .ace_cursor {\
color: black;\
}\
.ace-lusdl .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-lusdl .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-lusdl .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-lusdl .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-lusdl .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-lusdl .ace_fold {\
}\
.ace-lusdl .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-lusdl .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-lusdl .ace_support.ace_type,\
.ace-lusdl .ace_support.ace_class\
.ace-lusdl .ace_support.ace_other {\
color: rgb(109, 121, 222);\
}\
.ace-lusdl .ace_variable.ace_parameter {\
font-style:italic;\
color:#FD971F;\
}\
.ace-lusdl .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-lusdl .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-lusdl .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-lusdl .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-lusdl .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-lusdl .ace_marker-layer .ace_selection {\
background: rgba(45, 151, 221, 0.29);\
}\
.ace-lusdl .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-lusdl .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-lusdl .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-lusdl .ace_marker-layer .ace_active-line {\
background: rgba(133, 151, 170, 0.09);\
}\
.ace-lusdl .ace_gutter-active-line {\
background-color: rgba(66, 66, 66, 0.06);\
border-right: 1px solid rgba(66, 128, 178, 0.19);\
right: -1px;\
}\
.ace-lusdl .ace_marker-layer .ace_selected-word {\
background: rgba(66, 128, 178, 0.12);\
border-bottom: 1px solid rgba(66, 128, 178, 0.19);\
}\
.ace-lusdl .ace_storage,\
.ace-lusdl .ace_meta.ace_tag {\
color: rgb(147, 15, 128);\
}\
.ace-lusdl .ace_entity.ace_other.ace_attribute-name {\
color: #994409;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
