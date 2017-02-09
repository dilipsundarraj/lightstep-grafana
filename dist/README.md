# LightStep Grafana plugin

## Installation

Grafana 4 or newer is required for use the LightStep panel.

To install the plugin, copy the contents of the git repository to your plugins directory. The default on Linux systems is `/var/lib/grafana/plugins`.  Depending on your setup, you may need to restart your Grafana instance after the plug-in is installed.

If installation was successful, you should see something like the below:

![Installed Panels](doc/installed-panel.png)

## Usage

**NOTE:** *in order for the embedded graphs to display, you must be logged into LightStep in your browser.*

### Adding a LightStep Panel

![Add a panel](doc/add-panel.png)

### Update the panel JSON

There are two required parameters that need to be set in the panel JSON:

* **Project name**
* **ID of the operation or saved search**.

Edit the panel JSON in Grafana:

![Add a panel](doc/panel-json.png)

And set the appropriate project name and operation ID in the JSON:

```json
{
  "type": "lightstep-panel",
  "operationID": "OPERATION_ID",
  "project": "PROJECT_NAME"
}
```
