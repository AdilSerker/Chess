import * as three from 'three';
import { Mesh, Group } from 'three';
import { BoxBufferGeometry } from 'three';
import { Cell } from './Cell';
import { array } from './types';
import { Coordinates } from '../../chess/types/Coordinates';

export class Board {
    static font: three.Font;

    private field_: Mesh;
    private cells_: Cell[] = [];
    private charRow_: Group;
    private columnNum_: Group;
    
    public constructor() {
        
        let isWhiteCell = true;
        for (let x = 1; x <= 8; x++) {
            isWhiteCell = !isWhiteCell;
            for (let z = 1; z <= 8; z++) {
                this.cells_.push(new Cell(array[x], array[z], isWhiteCell));
                isWhiteCell = !isWhiteCell;
            }
        }
    }

    static async getFont() {
        const loader = new three.FontLoader();
        return await new Promise((resolve) => {
            loader.load( 'fonts/MontserratExtraLight_Regular.json', function ( font ) {
                Board.font = font;
                resolve(font);
            }, ( xhr ) => {
                if ( xhr.lengthComputable ) {
                    const percentComplete = xhr.loaded / xhr.total * 100;
                    // console.log( Math.round(percentComplete) + '% downloaded' );
                }
            }, (err) => { });
        });
    }

    public async getBoard(): Promise<Group> {
        this._initField();
        await this._initSymbols();

        const group: three.Group = new three.Group();
        group.add(this.field_);
        for ( const item of this.cells_) {
            group.add(item.getCell());
        }

        group.add(this.charRow_);
        group.add(this.columnNum_);
        
        return group;
    }

    public getCellById(id: number): Coordinates {
        const cell = this.cells_.filter((item: Cell) => {
            return item.id === id;
        })[0];
        return cell.coordinate;
    }

    private _initField() {
        const geometry = new three.BoxBufferGeometry(1800, 1, 1800);
        const material = new three.MeshStandardMaterial( {
            map: null,
            bumpScale: - 0.05,
            color: 0x444444,
            metalness: 1.5,
            roughness: 1.0
        } );
        this.field_ = new three.Mesh(geometry, material);

        this.field_.receiveShadow = true;
    }

    
    private async _initSymbols(): Promise<void> {
        this.charRow_ = new three.Group();
        this.columnNum_ = new three.Group();

        const chars = 'A B C D E F G H';
        const nums = '1 2 3 4 5 6 7 8';

        const SYMBOLS = chars.split(' ');
        const NUMBERS = nums.split(' ');
        
        const textMaterial = new three.MeshStandardMaterial({ color: 0x808080 });
        
        for (let i = 0; i < 8; ++i) {
            let z = array[i + 1];
            const geometry = new three.TextGeometry(SYMBOLS[i], {
                font: Board.font,
                size: 50,
                height: 5,
                curveSegments: 12,
                bevelThickness: 2,
                bevelSize: 1,
                bevelEnabled: true
            });
            
            const mesh = new Mesh( geometry, textMaterial );
            
            mesh.position.set(-880, 0, z * 100 - 20);
            mesh.rotation.z = - Math.PI * 0.5;
            mesh.rotation.x = - Math.PI * 0.5;
            this.charRow_.add(mesh);

            const mesh1 = new Mesh( geometry, textMaterial );
            mesh1.position.set(880, 0, z * 100 + 20);
            mesh1.rotation.z = Math.PI * 0.5;
            mesh1.rotation.x = - Math.PI * 0.5;
            this.charRow_.add(mesh1);
        }
        for (let j = 0; j < 8; j++) {
            let x = array[j + 1];
            const geometry = new three.TextGeometry(NUMBERS[j], {
                font: Board.font,
                size: 50,
                height: 5,
                curveSegments: 12,
                bevelThickness: 2,
                bevelSize: 1,
                bevelEnabled: true
            });

            const mesh = new Mesh( geometry, textMaterial );
            
            mesh.position.set(x * 100 - 30, 0, - 870);
            mesh.rotation.z = - Math.PI * 0.5;
            mesh.rotation.x = - Math.PI * 0.5;
            this.columnNum_.add(mesh);

            const mesh1 = new Mesh( geometry, textMaterial );
            mesh1.position.set(x * 100 + 25, 0, 870);
            mesh1.rotation.z = Math.PI * 0.5;
            mesh1.rotation.x = - Math.PI * 0.5;
            
            this.columnNum_.add(mesh1);
        }
    }
}