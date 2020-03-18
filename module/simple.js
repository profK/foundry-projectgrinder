/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { SimpleItemSheet } from "./item-sheet.js";
import { SimpleActorSheet } from "./actor-sheet.js";
import { PGActor } from "./pgactor.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */


Hooks.once("init", async function() {
  console.log(`Initializing Simple Worldbuilding System`);

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.initiative.formula = "1d20";
    CONFIG.Actor.entityClass = PGActor;

    CONFIG.stats = [
        "deftness", "agility", "strength","toughness", "perception",
        "mind", "spirituality","willpower", "beauty", "presence"
    ]
    CONFIG.skills = [
        "Acrobatics", "Air vehicles", "Area of Knowledge", "Beast Riding", "Charm",
        "Climbing", "Dodge", "Energy Weapons", "Find", "Fire Combat", "First Aid",
        "Heavy Weapons", "Hide", "Intimidation", "Land Vehicle", "Language",
        "Lifting", "Long Jumping", "Maneuver", "Melee Weapons", "Missile Weapons",
        "Persuasion", "Prestidigitation", "Professional Skill", "Running",
        "Security Systems", "Stealth", "Survival", "Swimming", "Taunt",
        "Test of Will", "Tracking", "Trick", "Unarmed Combat", "Water Vehicles"
    ]



  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dnd5e", SimpleActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dnd5e", SimpleItemSheet, {makeDefault: true});


});
