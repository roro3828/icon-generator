import {v4,v7} from "uuid"

/**
 * UUID
 */
export default class UUID{

    /**
     * UUID0
     */
    readonly uuid:Uint8Array;

    /**
     * ランダムなUUID v4を生成
     */
    constructor();
    /**
     * 指定したバージョンのUUIDを生成
     */
    constructor(ver:"v4"|"v7");
    /**
     * 文字列からUUIDを生成
     * @param uuid UUID
     */
    constructor(uuid:`${string}-${string}-${string}-${string}-${string}`);
    /**
     * 文字列からUUIDを生成
     * @param uuid UUID
     */
    constructor(uuid:string);
    constructor(any?:any){
        if(typeof any==="undefined"){
            any=v4();
        }

        if(typeof any==="string"){
            if(any==="v4"){
                any=v4();
            }
            else if(any==="v7"){
                any=v7();
            }
            const uuids=any.split("-");
            if(
                uuids.length===5 &&
                uuids[0].length===8 &&
                uuids[1].length===4 &&
                uuids[2].length===4 &&
                uuids[3].length===4 &&
                uuids[4].length===12
                ){
                this.uuid=new Uint8Array(16);
                for(let i=0;i<4;i++){
                    this.uuid[i]=parseInt(uuids[0][i*2],16)*0x10+parseInt(uuids[0][i*2+1],16);
                }
                for(let i=0;i<2;i++){
                    this.uuid[4+i]=parseInt(uuids[1][i*2],16)*0x10+parseInt(uuids[1][i*2+1],16);
                }
                for(let i=0;i<2;i++){
                    this.uuid[6+i]=parseInt(uuids[2][i*2],16)*0x10+parseInt(uuids[2][i*2+1],16);
                }
                for(let i=0;i<2;i++){
                    this.uuid[8+i]=parseInt(uuids[3][i*2],16)*0x10+parseInt(uuids[3][i*2+1],16);
                }
                for(let i=0;i<6;i++){
                    this.uuid[10+i]=parseInt(uuids[4][i*2],16)*0x10+parseInt(uuids[4][i*2+1],16);
                }
            }
            else if(uuids.length==1&&uuids[0].length==32){
                this.uuid=new Uint8Array(16);
                for(let i=0;i<16;i++){
                    const binary=parseInt(uuids[0][i*2],16)*0x10+parseInt(uuids[0][i*2+1],16);
                    this.uuid[i]=binary;
                }
            }
            else{
                throw Error(`UUID is invalid:${any}`);
            }
        }
        else{
            throw Error("UUID is invalid");
        }
    }

    /**
     * 文字列のUUIDを取得
     * @param hyphen ハイフンをつける
     * @returns UUID
     */
    public toString(hyphen:boolean=false):string{
        let uuid0="";
        let uuid1="";
        let uuid2="";
        let uuid3="";
        let uuid4="";

        for(let i=0;i<4;i++){
            uuid0+=("00"+this.uuid[i].toString(16)).slice(-2);
        }
        for(let i=0;i<2;i++){
            uuid1+=("00"+this.uuid[4+i].toString(16)).slice(-2);
        }
        for(let i=0;i<2;i++){
            uuid2+=("00"+this.uuid[6+i].toString(16)).slice(-2);
        }
        for(let i=0;i<2;i++){
            uuid3+=("00"+this.uuid[8+i].toString(16)).slice(-2);
        }
        for(let i=0;i<6;i++){
            uuid4+=("00"+this.uuid[10+i].toString(16)).slice(-2);
        }
        if(hyphen){
            return `${uuid0}-${uuid1}-${uuid2}-${uuid3}-${uuid4}`;
        }
        else{
            return `${uuid0}${uuid1}${uuid2}${uuid3}${uuid4}`;
        }
    }

    /**
     * JSON文字列化
     * @returns String
     */
    toJSON(){
        return this.toString();
    }

    /**
     * 文字列がUUIDかどうか
     * @param uuid 文字列
     * @returns bool
     */
    public static isUUID(uuid:string){
        try{
            new UUID(uuid);
            return true;
        }
        catch{
            return false;
        }
    }
    /**
     * UUIDの比較
     * @param uuid0
     * @param uuid1
     * @returns
     */
    public static compare(uuid0:UUID,uuid1:UUID){
        let r=0;
        for(let i=0;i<16;i++){
            const t=uuid0.uuid[i]-uuid1.uuid[i];
            if(t<0){
                r-=(1<<(15-i));
            }
            else if(0<t){
                r+=(1<<(15-i));
            }
        }
        return r;
    }
    /**
     * 比較
     * @param uuid
     * @returns
     */
    public compare(uuid:UUID){
        return UUID.compare(this,uuid);
    }

    /**
     * UUIDのバージョンを取得
     * @return ver
     */
    public get_ver(){
        return (this.uuid[6]>>4);
    }
    /**
     * UUID v7の場合タイムスタンプを取得
     * 違う場合0を返す
     */
    public get_timestamp(){
        if(this.get_ver()!=7){
            return 0;
        }
        let time=0;
        for(let i=0;i<6;i++){
            time=(time*256)+this.uuid[i];
        }
        return time;
    }
}