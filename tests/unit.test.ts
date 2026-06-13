import { describe, it, expect } from "vitest";
import { nextLeadStatus, waNumber, telNumber, LEAD_STATUSES } from "@/lib/constants";
import { PHONE_RE, leadSchema } from "@/lib/validation/schemas";

describe("lead status cycle", () => {
  it("advances through the lifecycle and wraps", () => {
    expect(nextLeadStatus("new")).toBe("contacted");
    expect(nextLeadStatus("contacted")).toBe("scheduled");
    expect(nextLeadStatus("scheduled")).toBe("done");
    expect(nextLeadStatus("done")).toBe("new");
  });
  it("covers every status", () => {
    expect(LEAD_STATUSES).toEqual(["new", "contacted", "scheduled", "done"]);
  });
});

describe("phone validation", () => {
  const ok = (v: string) => PHONE_RE.test(v.replace(/[\s-]/g, ""));
  it("accepts valid PK mobile numbers", () => {
    expect(ok("0311-3183186")).toBe(true);
    expect(ok("03113183186")).toBe(true);
    expect(ok("3113183186")).toBe(true);
  });
  it("rejects invalid numbers", () => {
    expect(ok("123")).toBe(false);
    expect(ok("abcd")).toBe(false);
    expect(ok("")).toBe(false);
  });
});

describe("whatsapp / tel formatting", () => {
  it("converts local to wa.me target", () => {
    expect(waNumber("0311-3183186")).toBe("923113183186");
  });
  it("strips formatting for tel", () => {
    expect(telNumber("0311-3183186")).toBe("03113183186");
  });
});

describe("leadSchema", () => {
  it("accepts a valid booking", () => {
    const r = leadSchema.safeParse({
      name: "Sana Khan", phone: "0311-3183186", service: "ac", area: "Hayatabad", urgency: "Urgent",
    });
    expect(r.success).toBe(true);
  });
  it("rejects a bad phone", () => {
    const r = leadSchema.safeParse({
      name: "Sana", phone: "12", service: "ac", area: "Hayatabad", urgency: "Urgent",
    });
    expect(r.success).toBe(false);
  });
});
