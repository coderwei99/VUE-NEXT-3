import { effect } from "../effect";
import { reactive } from "../reactive";
import { ref, isRef, unref, proxyRefs } from "../ref";
describe("reactive", () => {
  it("should hold a value", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
    a.value = 2;
    expect(a.value).toBe(2);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
  });

  test("isRef", () => {
    expect(isRef(ref(1))).toBe(true);

    expect(isRef(0)).toBe(false);
    expect(isRef(1)).toBe(false);
    // an object that looks like a ref isn't necessarily a ref
    expect(isRef({ value: 0 })).toBe(false);
    expect(unref(1)).toBe(1);
    expect(unref(ref(1))).toBe(1);
  });

  test("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "ghx",
    };
    const original = {
      k: "v",
    };
    const r1 = reactive(original);
    // 传入reactive对象
    const p1 = proxyRefs(r1);
    // objectWithRefs对象 （带ref 的object）
    const proxyUser = proxyRefs(user);

    expect(p1).toBe(r1);

    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("ghx");

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    proxyUser.name = "superman";
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("superman");
    expect(user.age.value).toBe(10);
  });
});
