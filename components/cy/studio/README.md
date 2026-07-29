# CY Studio framework

`/cy` is development tooling, not production-page code. New standard `XxxDemo.tsx` files must be thin definitions rendered by `CyModuleDemo`.

Keep in a module Demo file only its preview definitions, render callback, field-document references and optional title-layout default. Do not duplicate the preview grid, refresh, fullscreen Dialog, copy-configuration button, usage block or field-document UI.

Production Cases remain in their domain folder and must not import Studio components.
