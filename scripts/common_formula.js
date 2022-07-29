function get_element_table() {
    element_table = {}
    element_table['fire'] = {}
    element_table['fire']['fire'] = 0.25
    element_table['fire']['water'] = 0.50
    element_table['fire']['earth'] = 2.00
    element_table['fire']['holy'] = 0.75
    element_table['fire']['undead'] = 2.00
    element_table['fire']['poison'] = 0.75
    element_table['water'] = {}
    element_table['water']['fire'] = 2.00
    element_table['water']['water'] = 0.25
    element_table['water']['wind'] = 0.50
    element_table['water']['holy'] = 0.75
    element_table['water']['undead'] = 1.50
    element_table['water']['poison'] = 0.75
    element_table['earth'] = {}
    element_table['earth']['fire'] = 0.50
    element_table['earth']['earth'] = 0.25
    element_table['earth']['wind'] = 2.00
    element_table['earth']['holy'] = 0.75
    element_table['earth']['poison'] = 0.75
    element_table['wind'] = {}
    element_table['wind']['water'] = 2.00
    element_table['wind']['earth'] = 0.50
    element_table['wind']['wind'] = 0.25
    element_table['wind']['holy'] = 0.75
    element_table['wind']['poison'] = 0.75
    element_table['neutral'] = {}
    element_table['neutral']['ghost'] = 0.25
    element_table['ghost'] = {}
    element_table['ghost']['neutral'] = 0.25
    element_table['ghost']['ghost'] = 2.00
    element_table['ghost']['dark'] = 0.75
    element_table['ghost']['holy'] = 0.75
    element_table['ghost']['undead'] = 1.75
    element_table['dark'] = {}
    element_table['dark']['dark'] = 0.25
    element_table['dark']['holy'] = 2.00
    element_table['dark']['undead'] = 0.25
    element_table['dark']['poison'] = 0.25
    element_table['holy'] = {}
    element_table['holy']['dark'] = 2.00
    element_table['holy']['holy'] = 0.25
    element_table['holy']['undead'] = 2.00
    element_table['holy']['poison'] = 1.25
    element_table['poison'] = {}
    element_table['poison']['fire'] = 1.25
    element_table['poison']['earth'] = 1.25
    element_table['poison']['wind'] = 1.25
    element_table['poison']['ghost'] = 0.50
    element_table['poison']['dark'] = 0.25
    element_table['poison']['holy'] = 0.50
    element_table['poison']['undead'] = 0.25
    element_table['poison']['poison'] = 0.25
    return element_table
}

function get_or_default(dict, key, default_value) {
    return key in dict ?
        dict[key] :
        default_value
}

function as_mod(modifier_string) {
    return three_decimals(parseFloat(modifier_string) / 100)
}

function three_decimals(float_value) {
    return Math.round(float_value * 1000) / 1000.00
}

function five_decimals(float_value) {
    return Math.round(float_value * 100000) / 100000.00
}

function calc_modifier(incr_val_string, decr_val_string) {
    inc_val = as_mod(incr_val_string)
    decr_val = as_mod(decr_val_string)

    mod_val = 1 + inc_val - decr_val
    return three_decimals(Math.max(mod_val, 0.1))
}

function calc_elem_modifier(elem_atk_string, elem_reduct_string) {
    elem_atk = as_mod(elem_atk_string)
    elem_reduc = as_mod(elem_reduct_string)
    element_diff = elem_reduc - elem_atk
    element_diff = element_diff < -1.00 ? -1.00 : element_diff
    element_diff = element_diff > 1.00 ? 1.00 : element_diff
    element_diff = Math.floor(element_diff * 1000.00) / 1000.00

    element_temp_result = element_diff + 0.30 * (1 - Math.sin(element_diff * 3.14 / 2)) + 0.2
    element_result = 1 - element_temp_result
    return three_decimals(Math.max(element_result, 0.1))
}

function calc_race_modifier(racial_atk_string, racial_reduc_string) {
    racial_atk = as_mod(racial_atk_string)
    racial_reduc = as_mod(racial_reduc_string)

    racial_diff = racial_reduc - racial_atk
    racial_diff = Math.min(racial_diff, 1.00)
    racial_diff = Math.max(racial_diff, -1.00)
    racial_diff = Math.floor(racial_diff * 1000.00) / 1000.00

    racial_tmp_result = racial_diff + 0.4 * (1 - Math.sin(racial_diff * 3.14 / 2))
    racial_result = 1 - racial_tmp_result
    return three_decimals(Math.max(racial_result, 0.2))
}

function calc_def_modifier(patk_string, ignore_def_string, enemy_def_per_string, enemy_raw_def_string, enemy_vit_string) {
    patk = parseFloat(patk_string)
    ignore_def = as_mod(ignore_def_string)

    enemy_raw_def = parseFloat(enemy_raw_def_string)
    enemy_def_per = as_mod(enemy_def_per_string)
    enemy_vit = parseInt(enemy_vit_string)

    enemy_def_per = Math.min(enemy_def_per, 1.00)
    enemy_def_per = Math.max(enemy_def_per, -1.00)
    enemy_def_per = Math.floor(enemy_def_per * 1000) / 1000

    defense_percent = enemy_def_per + 0.5 * (1 - Math.sin(enemy_def_per * 3.14 / 2))
    special_pvp_modifier = 0.20

    temp_def_mod = 1 + defense_percent + special_pvp_modifier - ignore_def
    usable_def = enemy_raw_def - enemy_vit

    final_def = usable_def * temp_def_mod + (enemy_vit * 2)
    final_def = Math.max(final_def, 0.00)

    def_divisor = 4000 + (final_def * 10)
    def_divisor = def_divisor == 0 ? 1 : def_divisor

    stand_alone_defense_modifier = (4000 + final_def) / def_divisor

    stat_based_defense_modifier = 1 / (1 + (6 * final_def / patk))

    return three_decimals(Math.max(stand_alone_defense_modifier, stat_based_defense_modifier))
}

function calc_phys_modifier_from_refine(refine_lvl_string) {
    refine_lvl = parseInt(refine_lvl_string)

    if (refine_lvl >= 15) {
        return 0.036
    } else if (refine_lvl >= 10) {
        return 0.018
    } else if (refine_lvl >= 5) {
        return 0.009
    } else {
        return 0.00
    }
}

function calc_phys_modifier(phys_pen_string, dam_reduc_string, 
    weapon_refine_string, acce1_refine_string, acce2_refine_string, 
    reducts_from_skill_array) {
    phys_pen = as_mod(phys_pen_string)
    dam_reduc = as_mod(dam_reduc_string)

    dam_reduc_from_skills = 1.00
    for (current_dam_reduc_skill of reducts_from_skill_array) {
        if (current_dam_reduc_skill <= 0) {
            continue;
        }
        dam_reduc_from_skills = parseFloat(dam_reduc_from_skills) * parseFloat(current_dam_reduc_skill)
    }

    dam_reduc_from_skills = Math.max(dam_reduc_from_skills, 0.10)

    refine_pen = calc_phys_modifier_from_refine(weapon_refine_string) + 
                    calc_phys_modifier_from_refine(acce1_refine_string) + 
                    calc_phys_modifier_from_refine(acce2_refine_string)

    temp_phys_mod = 1 + phys_pen + refine_pen - dam_reduc
    temp_phys_mod = temp_phys_mod * dam_reduc_from_skills

    temp_dmg_reduc = 1 - temp_phys_mod
    temp_dmg_reduc = Math.min(temp_dmg_reduc, 1.00)
    temp_dmg_reduc = Math.max(temp_dmg_reduc, -1.00)
    temp_dmg_reduc = Math.floor(temp_dmg_reduc * 1000.00) / 1000.00

    dmg_reduc_result = temp_dmg_reduc + 0.3 * (1 - Math.sin(temp_dmg_reduc * 3.14 / 2)) + 0.2
    dmg_reduc_result = Math.min(dmg_reduc_result, 0.90)
    return three_decimals(1 - dmg_reduc_result)
}

