export class PGActor extends Actor {
    constructor(...args) {
        super(...args);
    }

    prepareData() {
        super.prepareData();
        const data = this.data;
        if ( data.hasOwnProperty("name") && !data.name ) {
            data.name = "New " + this.entity;
        }
        //calculate stat roll
        //calc d8s
        for(var stat in data.data.stats){
            var obj = data.data.stats[stat]
            obj.d8 = Math.trunc(obj.value/5)
            obj.plus = obj.value % 5
        }
        return data;
    }
}