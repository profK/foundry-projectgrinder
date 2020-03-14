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
            let tot = obj.plus-obj.damage
            if (tot<0) {
                obj.plusstr = tot.toString()
            } else if (tot>0){
                obj.plusstr = "+" + tot.toString()
            } else {
                obj.plusstr = ""
            }
        }
        //calc skill rolls
        for(let skillname in data.data.skills){
            let skill = data.data.skills[skillname]
            let statname = skill.current_stat
            if (statname== undefined){
                continue; // abort calc
            }
            let stat = data.data.stats[statname]
            skill.d8 = Math.trunc(stat.value/5)
            skill.plusstr = stat.plusstr

        }
        return data;
    }
}