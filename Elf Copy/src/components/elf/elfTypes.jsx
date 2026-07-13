/**
 * ELF — Backend Data Interfaces
 *
 * All values are null until the corresponding backend algorithm is integrated.
 * These factory functions define the exact shape expected from each backend module.
 */

/** Returned after AI photo analysis (YOLOv8) + GPS capture — Reporter flow */
export const createReportData = () => ({
  estimatedWeightKg: null,   // number   — YOLOv8 count × avg weight per item
  ecosystemUnits:    null,   // number   — EU reward calculated by risk-coefficient algorithm
  photoUrl:          null,   // string   — uploaded photo URL
  location: {
    lat: null,               // number   — GPS latitude
    lng: null,               // number   — GPS longitude
  },
  reportId:          null,   // string   — unique report identifier
  timestamp:         null,   // string   — ISO 8601 date
});

/** Notification payload when a Cleaner Elf finishes a reported spot */
export const createCleanedNotificationData = () => ({
  cleanerName:       null,   // string   — cleaner's display name
  cleanerAvatarUrl:  null,   // string   — cleaner's avatar image URL
  cleanedPhotoUrl:   null,   // string   — after-clean photo URL
  cleanedAt:         null,   // string   — ISO 8601 date
});

/** Route generation data — Cleaner flow (Screen 2) */
export const createRouteData = () => ({
  selectedArea:           null,   // 'mountain' | 'forest' | 'flat'
  gradeLabel:             null,   // string   — e.g. "B - 500 xp"
  trashRatio: {
    plastic:              null,   // number   — percentage 0–100
    organic:              null,   // number   — percentage 0–100
    metal:                null,   // number   — percentage 0–100
  },
  estimatedWeightKg:      null,   // number
  estimatedTimeMinutes:   null,   // number
  difficultyLabel:        null,   // string   — e.g. "Little exhausting"
  waypoints:              null,   // Array<{ lat: number, lng: number, level: number }>
  startLocation: {
    lat:                  null,   // number
    lng:                  null,   // number
  },
});

/** Cleaning mission result — Cleaner flow (Screen 5 & 6) */
export const createCleaningResultData = () => ({
  landName:                      null,   // string   — user-created land name
  ecosystemUnitsSaved:           null,   // number
  landLifeExtendedByLabel:       null,   // string   — e.g. "3 years 2 months"
  waterPollutionPreventedLabel:  null,   // string   — e.g. "50 liters"
  routeCoordinates:              null,   // Array<[number, number]> lat/lng pairs
  mapCenter: {
    lat:                         null,   // number
    lng:                         null,   // number
  },
});

/** Single entry on the leaderboard */
export const createLeaderboardUser = () => ({
  id:              null,   // string
  username:        null,   // string
  ecosystemUnits:  null,   // number
  rank:            null,   // number
  avatarInitial:   null,   // string   — first letter of display name
  locationLat:     null,   // number
  locationLng:     null,   // number
});

/** My Biome health data */
export const createBiomeData = () => ({
  ecosystemUnits:      null,   // number   — total EU earned lifetime
  healthPercentage:    null,   // number   — 0–100
  waterLevel:          null,   // number   — 0–100
  biodiversityScore:   null,   // number
});