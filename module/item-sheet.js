/**
 * Extend the basic ItemSheet with some very simple modifications
 */
export class SimpleItemSheet extends ItemSheet {
  constructor(...args) {
    super(...args);

    /**
     * Keep track of the currently active sheet tab
     * @type {string}
     */
    this._sheetTab = "description";
  }

  /**
   * Extend and override the default options used by the Simple Item Sheet
   * @returns {Object}
   */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
			classes: ["projectgrinder", "sheet", "item"],
			template: "systems/projectgrinder/templates/item-sheet.html",
			width: 520,
			height: 480,
		});
  }

  /* -------------------------------------------- */

  /**
   * Prepare data for rendering the Item sheet
   * The prepared data object contains both the actor data as well as additional sheet options
   */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    data.data.all_stats = CONFIG.stats
    data.data.all_skills = CONFIG.skills
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

    var clear_pulldowns = document.getElementsByClassName("clear_pulldown")
    for (let el of clear_pulldowns) {
      el.addEventListener("click", ev=>{
        $(ev.currentTarget).val("")
      }, false)
    }

    $("#add_action_button").click(ev=>{

      console.log("add action ")
      this.DoAddAction()
    })
  }

  /* -------------------------------------------- */
 async DoAddAction(){
    var data = this.getData().data
    var newitem = new Object({
      "name":"",
      "stat": "",
      "skill": "",
      "adds": 0
    })
    data.actions[data.actions.length] = newitem
    var item = this.item
    item.update({"data.actions":data.actions})
  }

  /* -------------------------------------------- */

  /**
   * Implement the _updateObject method as required by the parent class spec
   * This defines how to update the subject of the form when the form is submitted
   * @private
   */
  _updateObject(event, formData) {

    // Update the Item
    return this.object.update(formData);
  }
}
