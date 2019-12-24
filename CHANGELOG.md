# Changelog

## [Unreleased]

### Added

- Stats bar that shows: circulating supply, net hashrate and active accounts
- Metadata fields to block (txDensity, hashrate)

### Changed

- TxChart by TxDensityChart

### Fixed

- Box margins for small devices

## [1.0.2] 2019-09-26

### Changed

- Display block.minimumGasPrice in Gwei
- Contract verification form: remember uploaded files when the 'try again' action is called.

## [1.0.1] 2019-09-12

### Added

- 'Copy' button for all large files, even when they aren't trimmed.
- 'Copy & Download' buttons in all views that exports json data.

### Fixed

- Firefox render
- 'Try again' action on verify contract form

## [1.0.0] 2019-09-09

### Added

- Contract verification form

- Tab 'code' to address page which shows the **contract bytecode** and **'Verify'** button when the contract is unverified
  and **source**, **ABI** and **bytecode** when the contract was verified.

- Date to token transfers list

### Fixed

- Trim of contract name
- Unintended width overflows

### Changed

- Home, remove big menu
- Connection status message

## [0.8.2] 2019-07-29

### Fixed

- Address balance rendering

## [0.8.1] 2019-07-22

### Added

- Tab 'Mined blocks' to address page

### Fixed

- Big numbers render

## [0.8.0] 2019-06-04

### Added

- Decimals in token values

### Changed

- WS request to channel API

### Fixed

- Transaction fee calculation changed from **gas * gasPrice** to *gasUsed * gasPrice*

## [0.7.2] - 2019-03-05

### Added

- Entities/events, remasc events formatter.
- Entities/tokenTransfers
- Transfers tab to token account page
- Token Transfers tab to address page

### Fixed

- Default sort in DataTable component
- Entities/eventTransfer value field  

## [0.7.1] - 2019-02-22

### Fixed

- Sorts and queries in tabs (see #77)
- Searchbox, stopped propagation of keyup events
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
