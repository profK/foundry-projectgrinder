/**
 * Extend the basic ActorSheet with some very simple modifications
 */

import UUIDjs from "./uuid.js"

export class SimpleActorSheet extends ActorSheet {
  constructor(...args) {
    super(...args);

    /**
     * Keep track of the currently active sheet tab
     * @type {string}
     */
    this._sheetTab = "description";
  }

  /* -------------------------------------------- */

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   * @returns {Object}
   */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["projectgrinder", "sheet", "actor"],
  	  template: "systems/projectgrinder/templates/actor-sheet.html",
      width: 600,
      height: 600
    });
  }

  /* -------------------------------------------- */


  /**
   * Prepare data for rendering the Actor sheet
   * The prepared data object contains both the actor data as well as additional sheet options
   */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    for ( let attr of Object.values(data.data.attributes) ) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }

    return data;
  }


  /* -------------------------------------------- */



  /**
   * Activate event listeners using the prepared sheet HTML
   * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
   */
	activateListeners(html) {
    super.activateListeners(html);

    // Activate tabs
    let tabs = html.find('.tabs');
    let initial = this._sheetTab;
    new Tabs(tabs, {
      initial: initial,
      callback: clicked => this._sheetTab = clicked.data("tab")
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });
    // hook stat roll buttons
    html.find('.roll_stat_button').click(ev =>{
      const button = ev.currentTarget
      this.DoStatRoll(button.getAttribute('data-statname'))
    });

    // hook skil lroll buttons
    html.find('.roll_skill_button').click(ev =>{
      const button = ev.currentTarget
      this.DoSkillRoll(button.getAttribute('data-skillname'))
    });

    // Clear skill pulldown
    $("#skill_pulldown").click(ev => {
      console.log("click")
      $(ev.currentTarget).val("")
    });

    var clear_pulldowns = document.getElementsByClassName("clear_pulldown")
    for (let el of clear_pulldowns) {
      el.addEventListener("click", ev=>{
        $(ev.currentTarget).val("")
      }, false)
    }

    $("#add_skill_button").click(ev=>{
      var skillname = $("#skill_pulldown")
      console.log("add skill "+skillname.val())
      this.DoAddSkill(skillname.val())
    })

    $("#roll_button").click(ev=>{
      console.log('show roll dialog')
      $("#roll_dialog").show()
    })

    var action_buttons = document.getElementsByClassName("action_button")
    for (let el of action_buttons) {
      el.addEventListener("click", ev=> {
        const button = ev.currentTarget
        this.DoItemAction(button.getAttribute('data-itemkey'),
            button.getAttribute('data-actionkey'))
      })
    }
  }

  /* ------------------------------------------- */
  async DoItemAction(itemid,actionkey){
    const alldata = this.getData()
    const data = alldata.data
    const item = alldata.actor.items[parseInt(itemid,10)]
    const action = item.data.actions[actionkey]
    const dlg =$("#roll_action_dialog")
    data.form_data.current_item_name = item.name
    data.form_data.current_action_name = action.name
    const actor = this.actor
    actor.update({"data.form_data":data.form_data})
    dlg.show()
  }

  /* ------------------------------------------- */
  async DoAddSkill(skillname){
    const data = this.getData().data;
    data.skills[skillname]=
      {"name": skillname,
      "d6": 0,
      "advancement": 0
      }
    var actor = this.actor
    actor.update({"data.skills":data.skills})
  }
s
  /* -------------------------------------------- */

 async DoStatRoll(statname){
   console.log("doing roll")
   const data = this.getData().data;
   const stat = data.stats[statname]
   let rollstr = stat.d8.toString().concat("d8")
   let modifier = stat.plus - stat.damage
   if (modifier >0 ){
     rollstr = rollstr.concat("+",modifier.toString())
   } else if (modifier<0) {
     rollstr = rollstr.concat(modifier.toString())
   }
   console.log("rolling ".concat(rollstr))
   let roll =new Roll(rollstr).toMessage()
   rollstr.toMessage({
     flavor: "Makes a(n) "+statname+" roll..."
   })

 }

  async DoSkillRoll(skillname){
    console.log("doing skill roll")
    const data = this.getData().data;
    const skill = data.skills[skillname]
    let rollstr = ""
    if (skill.d8>0){
      rollstr = rollstr.concat( skill.d8.toString(),"D8")
    }
    if (skill.d6>0){
      rollstr = rollstr.concat("+",skill.d6.toString(),"D6x6")
    }
    rollstr = rollstr.concat(skill.plusstr)

    console.log("rolling ".concat(rollstr))
    new Roll(rollstr).roll().toMessage({
        flavor: "Makes a(n) "+skillname+" roll based on "+skill.current_stat+"..."
      }
    )
  }

  /* -------------------------------------------- */




  /* -------------------------------------------- */


}

function findSubObject(parent,fn) {
  for (let obj in parent)
  {
    if (fn(obj)) {
      return obj;
    }
  }
}
