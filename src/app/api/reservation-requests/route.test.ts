import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST } from "./route";

describe("POST /api/reservation-requests (deshabilitado)", () => {
  it("responde 503 sin guardar nada y sin leer el cuerpo", async () => {
    let bodyRead = false;
    const req = new Request("http://localhost/api/reservation-requests", {
      method: "POST",
      body: JSON.stringify({ roomSlug: "roos-corazon", guestName: "X" }),
    });
    const orig = req.json.bind(req);
    req.json = async () => {
      bodyRead = true;
      return orig();
    };
    const res = await (POST as unknown as (r?: Request) => Promise<Response>)(req);
    assert.equal(res.status, 503);
    const json = await res.json();
    assert.equal(json.status, "temporarily_disabled");
    assert.equal(json.whatsappFallback, true);
    assert.equal(bodyRead, false);
  });
});
