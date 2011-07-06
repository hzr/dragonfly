﻿window.templates || (window.templates = {});

templates.repl_main = function()
{
  return [
    "div", [[
      ["div", [
         "ol", "class", "repl-lines js-source"
         ], "class", "repl-output"],
      ["div", [[
        ["span", ">>>\xA0", "class", "repl-prefix"],
        ["div", ["textarea",
                 "focus-handler", "repl-textarea",
                 "blur-handler", "blur-textarea",
                 "rows", "1"]]
      ]], "class", "repl-input"]
    ]], "class", "padding"
  ];
};

templates.repl_output_native = function(s)
{
  return ["span", s, "class", "repl-native"];
};

templates.repl_output_native_or_pobj = function(thing)
{
  if (thing.type == "native") {
    return templates.repl_output_native(thing.value);
  }
  else
  {
    return templates.repl_output_pobj(thing);
  };
};

templates.repl_output_pobj = function(data)
{
  var is_element_type = settings.command_line.get("is-element-type-sensitive") && 
                        /(?:Element)$/.test(data.name)
  if (data.model)
  {
    var tmpl = window.templates[data.model_template](data.model, null, false, true);
    // the returned template is a innerHTML
    // the render call can handle that if the innerHTML is passed 
    // as a single field in an array 
    return ['span', [tmpl], 'class', 'repl-inline-expandable'];
  }

  return [
    'code',
    data.friendly_printed ? this.friendly_print(data.friendly_printed) : data.name,
    'handler', is_element_type ? 'inspect-node-link' : 'inspect-object-link',
    'rt-id', data.rt_id.toString(),
    'obj-id', data.obj_id.toString(),
    'class', 'repl-pobj'
  ];
};

templates.repl_output_traceentry = function(frame, index)
{
    var tpl = ['li',
      ui_strings.S_TEXT_CALL_STACK_FRAME_LINE.
        replace("%(FUNCTION_NAME)s", ( frame.objectValue ? frame.objectValue.functionName : ui_strings.ANONYMOUS_FUNCTION_NAME ) ).
        replace("%(LINE_NUMBER)s", ( frame.lineNumber || '-' ) ).
        replace("%(SCRIPT_ID)s", ( frame.scriptID || '-' ) ),
      'ref-id', index.toString(),
      'script-id', String(frame.scriptID), //.toString(),
      'line-number', String(frame.lineNumber),
      'scope-variable-object-id', String(frame.variableObject),
      'this-object-id', String(frame.thisObject),
      'arguments-object-id', String(frame.argumentObject)
    ];
  return tpl;
};

templates.repl_output_trace = function(trace)
{
  var lis = trace.frameList.map(templates.repl_output_traceentry);
  var tpl = ["div", ["ol", lis, "class", "console-trace",
                     'handler', 'select-trace-frame',
                     'runtime-id', trace.runtimeID.toString()
                    ],
                    "class", "console-trace-container"];
  return tpl;
};

templates.repl_group_line = function(group)
{
  return [["button", "class", "folder-key"+(group.collapsed ? "" : " open" ),
                     "handler", "repl-toggle-group", "group-id", group.id
          ], group.name];
};

templates.repl_output_location_link = function(id, line)
{
  return ["span", "(" + line + ")",
                          "class", "repl-output-go-to-source",
                          "handler", "show-log-entry-source",
                          "data-scriptid", String(id),
                          "data-scriptline", String(line)
         ];
}