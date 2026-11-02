import test from "node:test";
import assert from "node:assert/strict";
import { HISTORY_PERSISTENCE_ENABLED, INTEGRATION_CATALOG, getAccountMessage, getHistoryView, getUsageMessage } from "./workspace-settings-model.mjs";

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

