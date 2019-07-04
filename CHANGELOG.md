# Changelog

## [0.8.0] 2019-06-04

### Added

- Decimals in token values

### Changed

- WS request to channel API

### Fixed

- Transaction fee calculation changed from **gas * gasPrice** to *gasUsed * gasPrice*

## [0.7.2] - 2019-03-05

### Added

- Entitites/events, remasc events formatter.
- Entities/tokenTransfers
- Tranfers tab to token account page 
- Token Transfers tab to address page

### Fixed

- Default sort in DataTable component
- Entities/eventTransfer value field  

## [0.7.1] - 2019-02-22

### Fixed

- Sorts and queries in tabs (see #77)
- Searchbox, stoped propagation of keyup events
- EventId in event and transaction entities

## [0.7.0] - 2019-02-21

### Added

- Arrow keys navigation
- Navigation icons
- Icons: sort & rif

### Changed

- Store and API request are updated to new API version. (Pagination)
- Entities/event IDs

### Fixed

- Show timestamp as date in block page (see: #73)
