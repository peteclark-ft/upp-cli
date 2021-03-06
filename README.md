# UPP CLI
CLI for general UPP health checking. Currently supports:
* Shows health information for all environments by category.
* Shows failing healthchecks (and acknowledged ones).
* Acknowledge failing healthchecks.
* Remove acknowledgements.

## Installation

```
git clone git@github.com:peteclark-ft/upp-cli.git
cd ./upp-cli
touch env.json # Update the env.json file appropriately.
make
```

## Usage

Show health for all environments (without naming the failing healthchecks).

```
upp-cli health
```

Show health but filter environments/categories.

```
upp-cli health -f dyn
```

Show health with failing healthchecks/acknowledged.

```
upp-cli health -l
```

Acknowledge a healthcheck. (In this case acknowledge all system-healthchecks on all prod environments).

```
upp-cli ack ^prod.* system-healthcheck-.* -m "Not able to upgrade CoreOS PDC"
```

Remove an acknowledgement.

```
upp-cli ack ^prod.* system-healthcheck-.* -d
```

Open your browser with the aggregate healthcheck page(s) for provided environments.

```
upp-cli open ^prod"
```

All options accept Regex - but be careful as this will process the command on everything that matches.

## env.json

The `env.json` contains a list of all environments. For secrecy, this is not committed to github - please speak to me for details, or populate it yourself in the following format:

```
[
  {
    "name": "Environment Name",
    "url": "https://url/__health",
    "tunnel": "tunnel.com",
    "importance": 1,
    "category": "example"
  }
]
```

The url must contain the aggregate health page.

Category is useful for grouping environments logically and the importance value designates where in the output the category should appear (1 is most critical).

## Assumptions

You must have node pre-installed.

This is currently tested on OS X only.

In order to ack services, the process will ssh to the selected environment using default settings - please make sure this is possible.

i.e. Please check the following command works fine in your terminal:

```
ssh -t <tunnel url>
```
