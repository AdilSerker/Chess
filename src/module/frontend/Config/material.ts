import * as three from 'three';

export const material = (bool: boolean) => {
    return new three.MeshStandardMaterial({
        map: null,
        bumpScale: - 0.05,
        metalness:  bool ? 0 : 0.5,
        roughness:  bool ? 1 : 0.5,
        color: bool ? 0xffffff : 0x111111,
        wireframe: false
    });
}