function on_true_return(bool_value, return_value) {
    return bool_value ? return_value : 0.00;
}


function to_element_word(val) {
    var val_string = `${val}`;
    val_string = val_string.trim();

    var element_dict = {
        "0": "neutral",
        "1": "earth",
        "2": "fire",
        "3": "water",
        "4": "wind",
        "5": "holy",
        "6": "dark",
        "7": "ghost",
        "8": "poison",
        "9": "undead"
    }

    return element_dict[val_string] ?? "neutral";
}

function get_element_table() {
    var element_table = {};
    element_table["fire"] = {};
    element_table["fire"]["fire"] = 0.25;
    element_table["fire"]["water"] = 0.50;
    element_table["fire"]["earth"] = 2.00;
    element_table["fire"]["holy"] = 0.75;
    element_table["fire"]["undead"] = 2.00;
    element_table["fire"]["poison"] = 0.75;
    element_table["water"] = {};
    element_table["water"]["fire"] = 2.00;
    element_table["water"]["water"] = 0.25;
    element_table["water"]["wind"] = 0.50;
    element_table["water"]["holy"] = 0.75;
    element_table["water"]["undead"] = 1.50;
    element_table["water"]["poison"] = 0.75;
    element_table["earth"] = {};
    element_table["earth"]["fire"] = 0.50;
    element_table["earth"]["earth"] = 0.25;
    element_table["earth"]["wind"] = 2.00;
    element_table["earth"]["holy"] = 0.75;
    element_table["earth"]["poison"] = 0.75;
    element_table["wind"] = {};
    element_table["wind"]["water"] = 2.00;
    element_table["wind"]["earth"] = 0.50;
    element_table["wind"]["wind"] = 0.25;
    element_table["wind"]["holy"] = 0.75;
    element_table["wind"]["poison"] = 0.75;
    element_table["neutral"] = {};
    element_table["neutral"]["ghost"] = 0.25;
    element_table["ghost"] = {};
    element_table["ghost"]["neutral"] = 0.25;
    element_table["ghost"]["ghost"] = 2.00;
    element_table["ghost"]["dark"] = 0.75;
    element_table["ghost"]["holy"] = 0.75;
    element_table["ghost"]["undead"] = 1.75;
    element_table["dark"] = {};
    element_table["dark"]["dark"] = 0.25;
    element_table["dark"]["holy"] = 2.00;
    element_table["dark"]["undead"] = 0.25;
    element_table["dark"]["poison"] = 0.25;
    element_table["holy"] = {};
    element_table["holy"]["dark"] = 2.00;
    element_table["holy"]["holy"] = 0.25;
    element_table["holy"]["undead"] = 2.00;
    element_table["holy"]["poison"] = 1.25;
    element_table["poison"] = {};
    element_table["poison"]["fire"] = 1.25;
    element_table["poison"]["earth"] = 1.25;
    element_table["poison"]["wind"] = 1.25;
    element_table["poison"]["ghost"] = 0.50;
    element_table["poison"]["dark"] = 0.25;
    element_table["poison"]["holy"] = 0.50;
    element_table["poison"]["undead"] = 0.25;
    element_table["poison"]["poison"] = 0.25;
    return element_table;
}

function calc_generic_modifier(incr_string, redu_string) {
    var incr_modifier = as_modifier(incr_string);
    var redu_modifier = as_modifier(redu_string);

    var generic_modifier = 1.00 + incr_modifier - redu_modifier;

    return Math.max(standard_float(generic_modifier), 0.10);
}

function calc_pvp_element_modifier(element_atk_string, element_def_string) {
   var element_atk = as_modifier(element_atk_string);
   var element_def = as_modifier(element_def_string);

    var element_diff = standard_float(element_def - element_atk);
    element_diff = Math.max(element_diff, -1.00);
    element_diff = Math.min(element_diff, 1.00);
    element_diff = standard_float(element_diff);

    var element_temp_result = element_diff + 0.30 * (1.00 - Math.sin(element_diff * 3.14 / 2.00)) + 0.20;
    var element_modifier = standard_float(1.00 - element_temp_result);
    return Math.max(element_modifier, 0.10);
}

function calc_pvp_race_modifier(race_incr_string, race_redu_string) {
    var race_incr = as_modifier(race_incr_string);
    var race_redu = as_modifier(race_redu_string);

    var race_diff = standard_float(race_redu - race_incr);
    race_diff = Math.max(race_diff, -1.00);
    race_diff = Math.min(race_diff, 1.00);
    race_diff = standard_float(race_diff);

    var race_tmp_result = race_diff + 0.40 * (1 - Math.sin(race_diff * 3.14 / 2.00));
    var race_modifier = standard_float(1.00 - race_tmp_result);
    return Math.max(race_modifier, 0.20);
}

function calc_pve_race_modifier(race_incr_string, race_redu_string) {
    var race_modifier = generic_modifier(race_incr_string, race_redu_string);
    return Math.max(race_modifier, 0.20);
}

function calc_pvp_def_modifier(patk_string, ignore_def_string, defender_def_per_string, defender_raw_def_string, defender_vit_string) {
    var patk = parseFloat(patk_string);
    var ignore_def = as_modifier(ignore_def_string);

    var defender_raw_def = parseFloat(defender_raw_def_string);
    var defender_def_per = as_modifier(defender_def_per_string);
    var defender_vit = parseInt(defender_vit_string)

    defender_def_per = Math.min(defender_def_per, 1.00);
    defender_def_per = Math.max(defender_def_per, -1.00);
    defender_def_per = Math.floor(defender_def_per * 1000.00) / 1000.00;

    var defense_percent = defender_def_per + 0.50 * (1.00 - Math.sin(defender_def_per * 3.14 / 2.00));
    var special_pvp_modifier = 0.20;

    var temp_def_mod = standard_float(1 + defense_percent + special_pvp_modifier - ignore_def);
    var usable_def = defender_raw_def - defender_vit;

    var final_def = standard_float(usable_def * temp_def_mod + (defender_vit * 2));
    final_def = Math.max(final_def, 0.00);

    var def_divisor = 4000.00 + (final_def * 10.00);
    def_divisor = def_divisor == 0 ? 1.00 : def_divisor;

    var stand_alone_defense_modifier = standard_float((4000 + final_def) / def_divisor);

    var stat_based_defense_modifier = standard_float(1.00 / (1.00 + (6.00 * final_def / patk)));

    return Math.max(stand_alone_defense_modifier, stat_based_defense_modifier);
}

function calc_pve_def_modifier(patk_string, ignore_def_string, defender_def_per_string, defender_raw_def_string, defender_vit_string) {
    var patk = parseFloat(patk_string);
    var ignore_def = as_modifier(ignore_def_string);

    var defender_raw_def = parseFloat(defender_raw_def_string);
    var defender_def_per = as_modifier(defender_def_per_string);
    var defender_vit = parseInt(defender_vit_string)

    var defender_def_per = Math.floor(defender_def_per * 1000.00) / 1000.00;

    var defense_percent = defender_def_per + 0.50 * (1.00 - Math.sin(defender_def_per * 3.14 / 2.00))

    var temp_def_mod = standard_float(1 + defense_percent - ignore_def)
    var usable_def = defender_raw_def - defender_vit

    var final_def = standard_float(usable_def * temp_def_mod + (defender_vit * 2))
    final_def = Math.max(final_def, 0.00)

    var def_divisor = 4000.00 + (final_def * 10.00)
    def_divisor = def_divisor == 0 ? 1.00 : def_divisor

    var stand_alone_defense_modifier = standard_float((4000 + final_def) / def_divisor)

    var stat_based_defense_modifier = standard_float(1.00 / (1.00 + (6.00 * final_def / patk)))

    return Math.max(stand_alone_defense_modifier, stat_based_defense_modifier)
}

function calc_pen_from_refine(refine_lvl_string) {
    var refine_lvl = parseInt(refine_lvl_string);

    if (refine_lvl >= 15) {
        return 0.036;
    } else if (refine_lvl >= 10) {
        return 0.018;
    } else if (refine_lvl >= 5) {
        return 0.009;
    } else {
        return 0.00;
    }
}

function calc_pvp_physical_modifier(phys_pen_string, dam_redu_string, 
    weapon_refine_string, acce1_refine_string, acce2_refine_string, 
    redu_from_skills_array) {
    var phys_pen = as_modifier(phys_pen_string);
    var dam_redu = as_modifier(dam_redu_string);

    var total_dam_redu_from_skills = 1.00;
    for (current_dam_redu_skill of redu_from_skills_array) {
        if (current_dam_redu_skill <= 0) {
            continue;
        }
        total_dam_redu_from_skills = standard_float(total_dam_redu_from_skills * current_dam_redu_skill);
    }

    total_dam_redu_from_skills = Math.max(total_dam_redu_from_skills, 0.10);

    var refine_pen = calc_pen_from_refine(weapon_refine_string) + 
        calc_pen_from_refine(acce1_refine_string) + 
        calc_pen_from_refine(acce2_refine_string);

    var temp_phys_mod = 1 + phys_pen + refine_pen - dam_redu;
    temp_phys_mod = temp_phys_mod * total_dam_redu_from_skills;

    var temp_dmg_redu = standard_float(1 - temp_phys_mod);
    temp_dmg_redu = Math.min(temp_dmg_redu, 1.00);
    temp_dmg_redu = Math.max(temp_dmg_redu, -1.00);
    temp_dmg_redu = standard_float(temp_dmg_redu);

    var dmg_redu_result = temp_dmg_redu + 0.30 * (1.00 - Math.sin(temp_dmg_redu * 3.14 / 2.00)) + 0.20;
    dmg_redu_result = Math.min(dmg_redu_result, 0.90);
    return standard_float(1 - dmg_redu_result);
}

function calc_standard_physical_tier1(attacker_data, defender_data) {
    var patk = attacker_data["patk"];
    var weapon_penalty_index = attacker_data["weapon_penalty"];
    var weapon_penalty = 1 - (0.25 * weapon_penalty_index);

    var size_modifier = calc_generic_modifier(attacker_data["size_incr"], defender_data["size_redu"]);

    var attacker_element = attacker_data["forced_element"] ?? to_element_word(attacker_data["element"]);

    var element_table = get_element_table();
    var source_element_table = element_table[attacker_element] ?? {};
    var element_rate = source_element_table[to_element_word(defender_data["element"])] ?? 1.00;

    if(attacker_data["has_snowy_owl"] && element_rate > 1.00) {
        element_rate = element_rate * 1.10;
    }
    if(defender_data["has_divine_carver"] && element_rate > 1.00) {
        element_rate = 1.00;
    }
    if(attacker_data["has_lov"]) {
        element_rate = element_rate + 0.15;
    }

    var element_increase = 1.00 + as_modifier(attacker_data["elem_incr"]);
    var element_modifier = calc_pvp_element_modifier(attacker_data["elem_atk"], defender_data["elem_def"]);
    var total_modifiers = weapon_penalty * size_modifier * element_rate * element_increase * element_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(patk * total_modifiers);

    return {
        "weapon_penalty": weapon_penalty,
        "size_modifier": size_modifier,
        "element_rate": element_rate,
        "element_increase": element_increase,
        "element_modifier": element_modifier,

        "base_value": patk,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function calc_standard_melee_tier2(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var stat_dex = attacker_data["stat_dex"];
    var stat_str = attacker_data["stat_str"];
    var stat_luk = attacker_data["stat_luk"];
    var stat_atk = (stat_str * 2 + Math.floor(stat_str * stat_str / 100)) + Math.floor(stat_dex / 5) + Math.floor(stat_luk / 5);

    var race_modifier = calc_pvp_race_modifier(attacker_data["race_incr"], defender_data["race_redu"]);
    var pvp_modifier = calc_generic_modifier(attacker_data["pvp_incr"], defender_data["pvp_redu"]);
    var defense_modifier = calc_pvp_def_modifier(attacker_data["patk"], attacker_data["ignore_def"], 
        defender_data["def_per"], defender_data["def_raw"], defender_data["stat_vit"]);

    var redu_from_skills_array = [];
    if(defender_data["has_energy_coat"]) {
        redu_from_skills_array.push("0.30");
    }
    if(defender_data["has_heart_of_steel"]) {
        redu_from_skills_array.push("0.10");
    }
    if(defender_data["has_selfless_shield"]) {
        redu_from_skills_array.push("0.40");
    }
    if(defender_data["has_vanished"]) {
        redu_from_skills_array.push("0.20");
    }
    if(defender_data["has_epiclesis"]) {
        redu_from_skills_array.push("0.80");
    }
    if(defender_data["has_near_death_awaken"]) {
        redu_from_skills_array.push("0.70");
    }

    var physical_modifier = calc_pvp_physical_modifier(attacker_data["phys_pen"], defender_data["dam_redu"], 
        attacker_data["refine_weapon"], attacker_data["refine_acce1"], attacker_data["refine_acce2"], 
        redu_from_skills_array);

    var base_value = standard_float(previous_base_value + stat_atk);
    var total_modifiers = race_modifier * pvp_modifier * defense_modifier * physical_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_stat_atk = standard_float(stat_atk / base_value);
    var ratio_patk = standard_float(previous_base_value / base_value);

    return {
        "race_modifier": race_modifier,
        "pvp_modifier": pvp_modifier,
        "defense_modifier": defense_modifier,
        "physical_modifier": physical_modifier,

        "ratio_patk": ratio_patk,
        "ratio_stat_atk": ratio_stat_atk,

        "previous_base_value": previous_base_value,
        "stat_atk": stat_atk,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function collate_redu_from_skills(defender_data) {
    var redu_from_skills_array = [];
    if(defender_data["has_energy_coat"]) {
        redu_from_skills_array.push("0.30");
    }
    if(defender_data["has_heart_of_steel"]) {
        redu_from_skills_array.push("0.10");
    }
    if(defender_data["has_selfless_shield"]) {
        redu_from_skills_array.push("0.40");
    }
    if(defender_data["has_vanished"]) {
        redu_from_skills_array.push("0.20");
    }
    if(defender_data["has_epiclesis"]) {
        redu_from_skills_array.push("0.80");
    }
    if(defender_data["has_near_death_awaken"]) {
        redu_from_skills_array.push("0.70");
    }

    return redu_from_skills_array;
}

function calc_standard_range_tier2(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var stat_dex = attacker_data["stat_dex"];
    var stat_str = attacker_data["stat_str"];
    var stat_luk = attacker_data["stat_luk"];
    var stat_atk = (stat_dex * 2 + Math.floor(stat_dex * stat_dex / 100)) + Math.floor(stat_str / 5) + Math.floor(stat_luk / 5);

    var race_modifier = calc_pvp_race_modifier(attacker_data["race_incr"], defender_data["race_redu"]);
    var pvp_modifier = calc_generic_modifier(attacker_data["pvp_incr"], defender_data["pvp_redu"]);
    var defense_modifier = calc_pvp_def_modifier(attacker_data["patk"], attacker_data["ignore_def"], 
        defender_data["def_per"], defender_data["def_raw"], defender_data["stat_vit"]);

    var redu_from_skills_array = collate_redu_from_skills(defender_data);

    var physical_modifier = calc_pvp_physical_modifier(attacker_data["phys_pen"], defender_data["dam_redu"], 
        attacker_data["refine_weapon"], attacker_data["refine_acce1"], attacker_data["refine_acce2"], 
        redu_from_skills_array);

    var base_value = standard_float(previous_base_value + stat_atk);
    var total_modifiers = race_modifier * pvp_modifier * defense_modifier * physical_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_stat_atk = standard_float(stat_atk / base_value);
    var ratio_patk = standard_float(previous_base_value / base_value);

    return {
        "race_modifier": race_modifier,
        "pvp_modifier": pvp_modifier,
        "defense_modifier": defense_modifier,
        "physical_modifier": physical_modifier,

        "ratio_patk": ratio_patk,
        "ratio_stat_atk": ratio_stat_atk,

        "previous_base_value": previous_base_value,
        "stat_atk": stat_atk,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function calc_defender_refine_reduction(defender_data) {
    var offhand_refine = standard_float(defender_data["refine_offhand"]);
    var armor_refine = standard_float(defender_data["refine_armor"]);
    var garment_refine = standard_float(defender_data["refine_garment"]);
    var shoes_refine = standard_float(defender_data["refine_shoes"]);

    var total_refine = offhand_refine + armor_refine + garment_refine + shoes_refine;

    return standard_float(1 - (total_refine * 0.009));
}

function calc_standard_range_tier3_part1(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var refine_atk = attacker_data["refine_atk"];

    var refine_reduction = calc_defender_refine_reduction(defender_data);
    var range_redu = "range_redu" in defender_data ? defender_data["range_redu"] : 0.00
    var range_modifier = calc_generic_modifier(attacker_data["pdi"], range_redu);
    var skill_modifier = "skill_modifier" in attacker_data ? as_modifier(attacker_data["skill_modifier"]) : 1.00;

    var base_value = standard_float(previous_base_value + refine_atk);
    var total_modifiers = refine_reduction * range_modifier * skill_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_previous = standard_float(previous_base_value / base_value);
    var ratio_refine_atk = standard_float(refine_atk / base_value);

    return {
        "refine_reduction": refine_reduction,
        "range_modifier": range_modifier,
        "skill_modifier": skill_modifier,

        "ratio_previous": ratio_previous,
        "ratio_refine_atk": ratio_refine_atk,

        "previous_base_value": previous_base_value,
        "refine_atk": refine_atk,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}

function calc_standard_phys_tier3_part2(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var defender_vit_reduction = defender_data["stat_vit"] * 2.00;

    var rune_modifier = "rune_modifier" in attacker_data ? 1.00 + as_modifier(attacker_data["rune_modifier"]) : 1.00;

    var base_value = previous_base_value - defender_vit_reduction;
    var total_modifiers = rune_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    return {
        "rune_modifier": rune_modifier,

        "previous_base_value": previous_base_value,
        "defender_vit_reduction": defender_vit_reduction,
        "base_value": base_value,
        "total_modifiers": total_modifiers,
        "total_value": total_value
    }
}

function calc_standard_range_tier3(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);
    var tier3_part1 = calc_standard_range_tier3_part1(previous_base_value_string, attacker_data, defender_data);
    var tier3_part1_total_value = tier3_part1["total_value"];

    var tier3_part2 = calc_standard_phys_tier3_part2(tier3_part1_total_value.toString(), attacker_data, defender_data);
    var total_modifiers = tier3_part1["total_modifiers"] * tier3_part2["total_modifiers"]

    return {
        "refine_reduction": tier3_part1["refine_reduction"],
        "range_modifier": tier3_part1["range_modifier"],
        "skill_modifier": tier3_part1["skill_modifier"],
        "rune_modifier": tier3_part2["rune_modifier"],

        "ratio_previous": tier3_part1["ratio_previous"],
        "ratio_refine_atk": tier3_part1["ratio_refine_atk"],

        "previous_base_value": previous_base_value,
        "refine_atk": tier3_part1["refine_atk"],
        "base_value": tier3_part1["base_value"],

        "defender_vit_reduction": tier3_part2["defender_vit_reduction"],
        "part1_modifiers": tier3_part1["total_modifiers"],
        "part2_modifiers": tier3_part2["total_modifiers"],
        "total_modifiers": total_modifiers,
        "total_value": tier3_part2["total_value"]
    }
}

function count_statuses_afflicted(defender_data) {
    var statuses_afflicted_count = 0;

    for(var key in defender_data) {
        if(!key.startsWith("under_")) {
            continue;
        }
        var value = defender_data[key];
        if(value === true) {
            statuses_afflicted_count = statuses_afflicted_count + 1;
        }
    }

    return statuses_afflicted_count;
}

function calc_final_damage(attacker_data, defender_data) {
    var final_dmg_array = [];

    var under_poison = defender_data["under_poison"];
    var is_lod_active = under_poison || defender_data["under_bleed"] || defender_data["under_stun"] || 
        defender_data["under_curse"] || defender_data["under_silence"];

    final_dmg_array.push(is_lod_active ? standard_float(attacker_data["lod_count"] * 0.20) : 0.00);
    final_dmg_array.push(on_true_return(attacker_data["has_lod_depo"], is_lod_active ? 0.05 : 0.00));
    final_dmg_array.push(on_true_return(attacker_data["has_chimera_star"], under_poison ? 0.20 : 0.00));
    final_dmg_array.push(on_true_return(attacker_data["has_chimera_star_depo"], under_poison ? 0.05 : 0.00));
    final_dmg_array.push(on_true_return(attacker_data["has_glut_imp"], 0.05));

    var remaining_hp_per = standard_float(attacker_data["remaining_hp_per"]) / 100.00;
    remaining_hp_per = Math.max(remaining_hp_per, 0.01);
    var lost_hp_per = standard_float(1.00 - remaining_hp_per);
    final_dmg_array.push(on_true_return(attacker_data["has_cyborg_bunny"], lost_hp_per/10.00));
    final_dmg_array.push(on_true_return(attacker_data["has_dead_eddga"], lost_hp_per/10.00));

    final_dmg_array.push(on_true_return(attacker_data["has_love_goddess"], 0.10));
    final_dmg_array.push(on_true_return(attacker_data["has_wind_perch_drake"], 0.05));

    var master_tackler_lvl = standard_float(attacker_data["master_tackler_lvl"]);
    var chess_or_orb = defender_data["chess_orb"].toString();

    if(chess_or_orb === "1") {
        final_dmg_array.push(standard_float(master_tackler_lvl * 0.04));
    }
    if(chess_or_orb === "2") {
        final_dmg_array.push(standard_float(master_tackler_lvl * 0.07));
    }

    var status_afflicted_count = standard_float(count_statuses_afflicted(defender_data));
    final_dmg_array.push(on_true_return(attacker_data["has_ore_spirit"], status_afflicted_count * 0.05));
    final_dmg_array.push(on_true_return(attacker_data["has_chaotic_blade"], status_afflicted_count * 0.08));

    var war_ender_artifact = attacker_data["war_ender_artifact"].toString();
    if(war_ender_artifact === "1") {
        final_dmg_array.push(0.30);
    }
    if(war_ender_artifact === "2") {
        final_dmg_array.push(0.50);
    }

    var mysteltainn_artifact = standard_float(attacker_data["mysteltainn_artifact"]);
    final_dmg_array.push(mysteltainn_artifact * 0.30);

    var total_final_dmg = 1.00;
    for (current_final_dmg of final_dmg_array) {
        var current_final_dmg_float = standard_float(current_final_dmg);
        if (current_final_dmg_float <= 0) {
            continue;
        }
        total_final_dmg = total_final_dmg + current_final_dmg_float;
    }
    return standard_float(total_final_dmg);
}

function build_status_dmg_data(attacker_data, defender_data) {
    if(defender_data["under_poison"]) {
        var status_dmg_array = [];
        status_dmg_array.push(on_true_return(attacker_data["has_poison_tail"], 0.10));
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "poison",
            "status_dmg": total_status_dmg
        };
    }

    if(defender_data["under_freeze"]) {
        var status_dmg_array = [];
        status_dmg_array.push(on_true_return(attacker_data["has_marina_depo_combo"], 0.25));
        status_dmg_array.push(on_true_return(attacker_data["has_garm_depo_combo"], 0.20));
        status_dmg_array.push(on_true_return(attacker_data["has_stormy_knight_combo"], 0.10));
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "freeze",
            "status_dmg": total_status_dmg
        };
    }

    if(defender_data["under_bleed"]) {
        var status_dmg_array = [];
        status_dmg_array.push(on_true_return(attacker_data["has_moonlight_swing"], 0.05));
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "bleed",
            "status_dmg": total_status_dmg
        };
    }

    if(defender_data["under_stun"]) {
        var status_dmg_array = [];
        status_dmg_array.push(on_true_return(attacker_data["has_orc_hero_depo_combo"], 0.15));
        status_dmg_array.push(on_true_return(attacker_data["has_thunder_kabuto"], 0.15));
        status_dmg_array.push(attacker_data["rotar_zairo_star_count"] * 0.10);
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "stun",
            "status_dmg": total_status_dmg
        };
    }

    curse_hand_bonus = 0.00;
    if(attacker_data["has_cursed_hand_acce1"]) {
        curse_hand_bonus = curse_hand_bonus + (standard_float(attacker_data["refine_acce1"]) * 0.01);
    }
    if(attacker_data["has_cursed_hand_acce2"]) {
        curse_hand_bonus = curse_hand_bonus + (standard_float(attacker_data["refine_acce2"]) * 0.01);
    }

    if(defender_data["under_curse"]) {
        var status_dmg_array = [];
        status_dmg_array.push(curse_hand_bonus);
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "curse",
            "status_dmg": total_status_dmg
        };
    }

    if(defender_data["under_fear"]) {
        var status_dmg_array = [];
        status_dmg_array.push(curse_hand_bonus);
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "fear",
            "status_dmg": total_status_dmg
        };
    }

    if(defender_data["under_darkness"]) {
        var status_dmg_array = [];
        status_dmg_array.push(curse_hand_bonus);
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "darkness",
            "status_dmg": total_status_dmg
        };
    }

    if(defender_data["under_silence"]) {
        var status_dmg_array = [];
        status_dmg_array.push(curse_hand_bonus);
        var total_status_dmg = 1.00;
        for(var current_status_dmg of status_dmg_array) {
            total_status_dmg = total_status_dmg + current_status_dmg;
        }
        total_status_dmg = standard_float(total_status_dmg);
        return {
            "status": "silence",
            "status_dmg": total_status_dmg
        };
    }

    return {
        "status": "none",
        "status_dmg": 1.00
    }
}

function calc_standard_skill_tier4(previous_base_value_string, attacker_data, defender_data) {
    var previous_base_value = standard_float(previous_base_value_string);

    var monocular_option = standard_float(attacker_data["refine_monocular"]);
    monocular_option = Math.min(monocular_option, 6);
    var monocular_percentage = 0.00;
    if(monocular_option > 0) {
        monocular_percentage = 0.15 + (monocular_option * 0.05)
    }
    var patk = standard_float(attacker_data["patk"]);
    var matk = standard_float(attacker_data["matk"]);
    var monocular_true_dmg = standard_float((patk + matk) * monocular_percentage);

    var guild_prayer_true_skill = standard_float(attacker_data["guild_prayer_true_skill"]);
    guild_prayer_true_skill = Math.max(guild_prayer_true_skill, 0.00);
    guild_prayer_true_skill = Math.min(guild_prayer_true_skill, 15.00);
    var guild_prayer_true_dmg = standard_float(guild_prayer_true_skill * 150.00);

    var true_dmg = standard_float(monocular_true_dmg + guild_prayer_true_dmg);

    var skill_dmg_modifier = calc_generic_modifier(attacker_data["skill_dmg_incr"], defender_data["skill_dmg_redu"]);

    var final_dmg_modifier = calc_final_damage(attacker_data, defender_data);

    var status_dmg_data = build_status_dmg_data(attacker_data, defender_data);
    var status_dmg_type = status_dmg_data["status"];
    var status_dmg_modifier = status_dmg_data["status_dmg"];

    var base_value = standard_float(previous_base_value + true_dmg);
    var total_modifiers = skill_dmg_modifier * final_dmg_modifier * status_dmg_modifier;
    total_modifiers = standard_float(total_modifiers);
    var total_value = standard_float(base_value * total_modifiers);

    var ratio_previous = standard_float(previous_base_value / base_value);
    var ratio_true_dmg = standard_float(true_dmg / base_value);

    return {
        "skill_dmg_modifier": skill_dmg_modifier,
        "final_dmg_modifier": final_dmg_modifier,
        "status_dmg_type": status_dmg_type,
        "status_dmg_modifier": status_dmg_modifier,

        "ratio_previous": ratio_previous,
        "ratio_true_dmg": ratio_true_dmg,

        "previous_base_value": previous_base_value,
        "true_dmg": true_dmg,
        "base_value": base_value,

        "total_modifiers": total_modifiers,
        "total_value": total_value
    };
}