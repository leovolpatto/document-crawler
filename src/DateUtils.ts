export class DateUtils{

    public static toString(dt: Date)  : string{
        const s: string =
        `${dt.getFullYear()}${(dt.getMonth() + 1).toString().padStart(2, '0')}${dt.getDate().toString().padStart(2, '0')}${dt.getHours().toString().padStart(2, '0')}${dt.getMinutes().toString().padStart(2, '0')}${dt.getSeconds().toString().padStart(2, '0')}${dt.getMilliseconds().toString().padStart(3, '0')}`;

        return s;
    }

    public static toSqsString(dt: Date)  : string{
        const year = dt.getFullYear();
        const month = (dt.getMonth() + 1).toString().padStart(2, '0');
        const day = dt.getDate().toString().padStart(2, '0');
        const hour = dt.getHours().toString().padStart(2, '0');
        const mins = dt.getMinutes().toString().padStart(2, '0');
        const secs = dt.getSeconds().toString().padStart(2, '0');
        const milis = dt.getMilliseconds().toString().padStart(3, '0');
        
        const s: string = `${year}-${month}-${day} ${hour}:${mins}:${secs}.${milis}`;

        return s;
    }    

}