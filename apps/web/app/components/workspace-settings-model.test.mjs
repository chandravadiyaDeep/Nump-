import test from "node:test";
import assert from "node:assert/strict";
import {
  API_ACCESS_CONFIG,
  COMMERCIAL_PLAN_TIERS,
  HISTORY_PERSISTENCE_ENABLED,
  INTEGRATION_CATALOG,
  getAccountMessage,
  getApiAccessDetails,
  getHistoryView,
  getPlanDetails,
  getUsageMessage,
} from "./workspace-settings-model.mjs";

test("history remains unavailable without an approved persistence source and never invents records", () => {
  assert.equal(HISTORY_PERSISTENCE_ENABLED, false);
  assert.deepEqual(getHistoryView({ records: [{ dataset_label: "fabricated" }] }), { state: "unavailable", records: [] });
});

test("an enabled history view distinguishes empty and real record collections", () => {
  assert.deepEqual(getHistoryView({ enabled: true, records: [] }), { state: "empty", records: [] });
  const record = { id: "opaque", created_at: "2026-01-01T00:00:00Z" };
  assert.deepEqual(getHistoryView({ enabled: true, records: [record] }), { state: "records", records: [record] });
});

test("account presentation uses only the session email and describes unavailable auth states", () => {
  assert.equal(getAccountMessage({ status: "signed-in", email: "person@example.test" }), "person@example.test");
  assert.equal(getAccountMessage({ status: "signed-out", email: null }), "Sign in to view the account email available to this session.");
  assert.doesNotMatch(getAccountMessage({ status: "signed-in", email: "person@example.test" }), /user.?id|token|credential/i);
});

test("usage is unavailable without a real metering source and catalog entries remain planned", () => {
  assert.match(getUsageMessage(), /not available/i);
  assert.equal(INTEGRATION_CATALOG.length, 7);
  assert.ok(INTEGRATION_CATALOG.every((item) => item.name && item.stage && item.value));
});

test("API access details report no active client keys and describe server-side key requirements", () => {
  const details = getApiAccessDetails();
  assert.equal(details.hasActiveKeys, false);
  assert.match(details.message, /server-side/i);
  assert.equal(details.baseUrl, "https://numpa-api.onrender.com");
  assert.equal(API_ACCESS_CONFIG.authScheme, "Authorization: Bearer <token>");
  assert.doesNotMatch(details.message, /fake|numpa_live/i);
});

test("commercial plan tiers report free evaluation active and other plans planned", () => {
  assert.equal(COMMERCIAL_PLAN_TIERS.length, 4);
  const freeTier = COMMERCIAL_PLAN_TIERS.find((t) => t.name.startsWith("Free"));
  assert.ok(freeTier);
  assert.match(freeTier.status, /evaluation/i);

  const planDetails = getPlanDetails(false);
  assert.equal(planDetails.currentTier, "Free (Evaluation)");
  assert.equal(planDetails.isMetered, false);
  assert.match(planDetails.message, /unmetered/i);

  const syncedPlan = getPlanDetails(true);
  assert.match(syncedPlan.message, /synchronized/i);
});
