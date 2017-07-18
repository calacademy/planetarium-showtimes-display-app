# planetarium-showtimes-display-app

VueJS web application for planetarium showtimes display.

## Installation

Clone planetarium-showtimes-display-app repo locally.

Unpack node modules via Yarn:

```
$ cd planetarium-showtimes-display-app
$ yarn
```

Find .env file and fonts.zip files in team Google Drive:
```
+-- DME: Web & Interactive
|   +-- Exhibit Interactives
|   |   +-- Planetarium Showtimes Display App
|   |   |   +-- Technical
```

Copy .env into root of local lobby-wall-events-map project.

Unzip and copy 'fonts' directory into root 'static' directory.

## Testing

A testing framework set up for project, but currently there is only a trivial
e2e placeholder test in place.

```
yarn test
```

## Build Notes

### .env variable for webpack module bundler build
The URL for the events data feed is saved as global EVENTS_API_URL variable
expected by webpack for dev and prod distribution builds. The variable is
saved in local .env file in project root and excluded from git repo.


## Development and Production Builds

Webpack build init scripts in package.json.

```
yarn dev
yarn build
```

## Deploy Notes

The deploy script deletes s3://planetarium-showtimes.calacademy.org content and copies local dist folder contents to s3://planetarium-showtimes.calacademy.org.

```
yarn deploy
```
