# Changelog

## [1.3.0] 2021-01-26

### Added

- Constructor arguments to verify contract form.
- Contract verifier suggestions in contract's verification result.

## [1.2.3] 2021-01-14

### Fixed

- Tx logs tab
- Tx transfer events tab

## [1.2.2] 2021-01-08

## Breaking changes

- This version requires rsk-explorer-api v 1.1.7+

### Fixed

- Data in event argument
- Token account decimals
- Form button style
- Navbar style

### Added

- User settings
- Csv export
- List export
- Uncle count field to block
- Uncles list to block
- User's managed lists decimals
- Home: Add 2WP Locking cap
- Status field description of txs in pool

### Changed

- Export filtered data instead of raw API's data.
- Home: Remove bridge balance stats
- RBTC icon

## [1.2.1] - 2020-09-25

### Fixed

- Hotjar button style collision
- Home, new block message
- Home stats, equalize boxes heights

### Added

- InternalTransaction view, copy & download buttons
- Network name to document title, closes #87
- Formatted arguments to event list, closes #98
- BlockNumber to address balance, closes #102
- Approval event formatter

### Changed

- SearchBox placeholder, 'name' by 'token name'
- NumberFilters, add space before unit
- Circulating supply title to 'BTC Value Locked in 2WP'

## [1.2.0] 2020-07-13

## Breaking changes

- This version requires explorer-api v 1.1.0+

### Fixed

- TxDensity chart overflow
- Address checksum messages

### Added

- Internal Transactions
- Address Balances
- User feedback
- Auto refresh of pending transactions when new block arrives

## [1.1.2] 2020-03-11

### Changed

- Disable address checksum

## [1.1.1] 2020-03-04

### Added

- Support uppercase in block hash and tx hash

### Fixed

- Decimals in token accounts views

## [1.1.0] 2020-02-26

### Added

- Mining information to blocks
- Search page
- Check Address page
- Search results while typing
- Address search by name
- Block search by hash
- EIP1191 support: display checksummed addresses, check address checksum on search

### Changed

- Menu: change media queries and remove 'home' item

### Fixed

- Display of field-value in tables
- store/backend/actions/socketData()

## [1.0.6] 2020-01-13

### Changed

- Search input by custom component
- Socket.io configuration, try to use WS first

## [1.0.5] 2020-01-10

### Changed
  
- vue-gtag version

### Fixed

- BigField, rlp selection at start

## [1.0.4] 2020-01-09

### Added

- Privacy policy in footer
- Optional google tag tracking
- Licence
- Field descriptions
- Circle-CI configuration
- Network name in header
- Block extradata decoding
- TxDensity & hashrate in BlockBox
- Metadata fields to block
- Stats bar that shows: circulating supply, net hashrate and active accounts


### Changed

- Copyright date
- localStorage provider
- entities/eventId

### Fixed

- Field title on grid view
- Box margins for small screens

### Removed

- BlockHashRate from BlockBox

## [1.0.3] 2019-11-15

### Fixed

- Transaction fee calculation
- components/VerifyContract, show nightly versions
- Display of large events

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
