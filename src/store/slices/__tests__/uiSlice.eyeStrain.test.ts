import reducer, { setEyeStrainMode, toggleEyeStrainMode } from '../uiSlice';

describe('uiSlice eye-strain mode', () => {
  it('is false by default and can be toggled on/off', () => {
    const initial = reducer(undefined, { type: '@@INIT' } as any);
    expect(initial.eyeStrainMode).toBe(false);

    const on = reducer(initial, setEyeStrainMode(true));
    expect(on.eyeStrainMode).toBe(true);
    expect(document.documentElement.classList.contains('eye-strain')).toBe(true);

    const off = reducer(on, toggleEyeStrainMode());
    expect(off.eyeStrainMode).toBe(false);
    expect(document.documentElement.classList.contains('eye-strain')).toBe(false);
  });
});
