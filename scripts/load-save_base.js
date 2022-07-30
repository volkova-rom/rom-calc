function save_as_base64(dict) {
    json_string = JSON.stringify(dict)
    return btoa(json_string)
}

function load_from_base64(base64_string) {
    json_string = atob(base64_string)
    return JSON.parse(json_string)
}

function elem_set_value(value, id_destination) {
    element = document.getElementById(id_destination)
    if (element != null) {
        element.value = value
    }
}

function elem_set_checked(bool_value, id_destination) {
    element = document.getElementById(id_destination)
    if (element != null) {
        element.checked = bool_value
    }
}

function elem_set_selected_index(index_value, id_destination) {
    element = document.getElementById(id_destination)
    if (element != null) {
        element.selectedIndex = index_value
    }
}

function save_base_attacker_data() {
    attacker_data = {
        "patk": giv("i_patk"),
        "weap_penalty": gi("i_weap-penalty").selectedIndex ,
        "size_inc": giv("i_size-inc"),
        "attacker_elem": gi("i_attacker-elem").selectedIndex ,
        "has_snowy_owl": is_checked("i_has-snowy-owl"),
        "has_lov": is_checked("i_has-lov"),
        "elem_inc": giv("i_elem-inc"),
        "elem_atk": giv("i_elem-atk"),
        "attacker_dex": giv("i_attacker-dex"),
        "attacker_str": giv("i_attacker-str"),
        "attacker_luk": giv("i_attacker-luk"),
        "race_inc": giv("i_race-inc"),
        "pvp_inc": giv("i_pvp-inc"),
        "ig_def": giv("i_ig-def"),
        "phys_pen": giv("i_phys-pen"),
        "weapon_refine": gi("i_weapon-refine").selectedIndex ,
        "acce1_refine": gi("i_acce1-refine").selectedIndex ,
        "acce2_refine": gi("i_acce2-refine").selectedIndex ,
        "refine_atk": giv("i_refine-atk"),
        "pdi": giv("i_pdi"),
        "final_dmg": {
            "lod_count": gi("i_lod-count").selectedIndex ,
            "has_lod_depo": is_checked("i_has-lod-depo"),
            "has_chimera_star": is_checked("i_has-chimera-star"),
            "has_chimera_star_depo": is_checked("i_has-chimera-star-depo"),
            "has_glut_imp": is_checked("i_has-glut-imp"),
            "remaining_hp_per": giv("i_remaining-hp-per"),
            "has_cyborg_bunny": is_checked("i_has-cyborg-bunny"),
            "has_love_goddess": is_checked("i_has-love-goddess"),
            "has_wind_perch_drake": is_checked("i_has-wind-perch-drake"),
            "master_tackler_lvl": gi("i_master-tackler-lvl").selectedIndex,
            "chess_orb": gi("i_chess-orb").selectedIndex,
            "status_afflicted_count": giv("i_status-afflicted-count"),
            "has_ore_spirit": is_checked("i_has-ore-spirit"),
            "has_chaotic_blade": is_checked("i_has-chaotic-blade"),
            "war_ender_artifact": gi("i_war-ender-artifact").selectedIndex,
            "mysteltainn_artifact": gi("i_mysteltainn-artifact").selectedIndex
        },
        "status_dmg": {
            "under_poison": is_checked("i_under-poison"),
            "has_poison_tail": is_checked("i_has-poison-tail"),

            "under_stun": is_checked("i_under-stun"),
            "has_orc_hero_depo_combo": is_checked("i_has-orc-hero-depo-combo"),
            "has_thunder_kabuto": is_checked("i_has-thunder-kabuto"),
            "rotar_zairo_star_count": gi("i_rotar-zairo-star-count").selectedIndex,

            "under_freeze": is_checked("i_under-freeze"),
            "has_marina_depo_combo": is_checked("i_has-marina-depo-combo"),
            "has_garm_depo_combo": is_checked("i_has-garm-depo-combo"),
            "has_stormy_knight_combo": is_checked("i_has-stormy-knight-combo"),

            "under_bleed": is_checked("i_under-bleed"),
            "has_moonlight_swing": is_checked("i_has-moonlight-swing"),

            "under_fear": is_checked("i_under-fear"),
            "under_curse": is_checked("i_under-curse"),
            "under_silence": is_checked("i_under-silence"),
            "under_darkness": is_checked("i_under-darkness"),

            "cursed_hand_acce1": is_checked("i_cursed-hand_acce1"),
            "cursed_hand_acce2": is_checked("i_cursed-hand_acce2")
        },
        "matk": giv("i_matk"),
        "monocular_refine": gi("i_monocular-refine").selectedIndex,
        "guild_prayer_true_skill": giv("i_guild-prayer_true-skill"),
        "skill_dmg_inc": giv("i_skill-dmg-inc"),
    }

    return attacker_data
}

function load_base_attacker_data(attacker_data) {
    ad = attacker_data

    elem_set_value(ad["patk"], "i_patk")
    elem_set_selected_index(ad["weap_penalty"], "i_weap-penalty")
    elem_set_value(ad["size_inc"], "i_size-inc")
    elem_set_selected_index(ad["attacker_elem"], "i_attacker-elem")
    elem_set_checked(ad["has_snowy_owl"], "i_has-snowy-owl")
    elem_set_checked(ad["has_lov"], "i_has-lov")
    elem_set_value(ad["elem_inc"], "i_elem-inc")
    elem_set_value(ad["elem_atk"], "i_elem-atk")
    elem_set_value(ad["attacker_dex"], "i_attacker-dex")
    elem_set_value(ad["attacker_str"], "i_attacker-str")
    elem_set_value(ad["attacker_luk"], "i_attacker-luk")
    elem_set_value(ad["race_inc"], "i_race-inc")
    elem_set_value(ad["pvp_inc"], "i_pvp-inc")
    elem_set_value(ad["ig_def"], "i_ig-def")
    elem_set_value(ad["phys_pen"], "i_phys-pen")
    elem_set_selected_index(ad["weapon_refine"], "i_weapon-refine")
    elem_set_selected_index(ad["acce1_refine"], "i_acce1-refine")
    elem_set_selected_index(ad["acce2_refine"], "i_acce2-refine")
    elem_set_value(ad["refine_atk"], "i_refine-atk")
    elem_set_value(ad["pdi"], "i_pdi"),
    elem_set_value(ad["matk"], "i_matk"),
    elem_set_selected_index(ad["monocular_refine"], "i_monocular-refine")
    elem_set_selected_index(ad["guild_prayer_true_skill"], "i_guild-prayer_true-skill")
    elem_set_value(ad["skill_dmg_inc"], "i_skill-dmg-inc")

    fd = attacker_data["final_dmg"]
    elem_set_selected_index(fd["lod_count"], "i_lod-count")
    elem_set_checked(fd["has_lod_depo"], "i_has-lod-depo")
    elem_set_checked(fd["has_chimera_star"], "i_has-chimera-star")
    elem_set_checked(fd["has_chimera_star_depo"], "i_has-chimera-star-depo")
    elem_set_checked(fd["has_glut_imp"], "i_has-glut-imp")
    elem_set_value(fd["remaining_hp_per"], "i_remaining-hp-per")
    elem_set_checked(fd["has_cyborg_bunny"], "i_has-cyborg-bunny")
    elem_set_checked(fd["has_love_goddess"], "i_has-love-goddess")
    elem_set_checked(fd["has_wind_perch_drake"], "i_has-wind-perch-drake")
    elem_set_selected_index(fd["master_tackler_lvl"], "i_master-tackler-lvl")
    elem_set_selected_index(fd["chess_orb"], "i_chess-orb")
    elem_set_value(fd["status_afflicted_count"], "i_status-afflicted-count")
    elem_set_checked(fd["has_ore_spirit"], "i_has-ore-spirit")
    elem_set_checked(fd["has_chaotic_blade"], "i_has-chaotic-blade")
    elem_set_selected_index(fd["war_ender_artifact"], "i_war-ender-artifact")
    elem_set_selected_index(fd["mysteltainn_artifact"], "i_mysteltainn-artifact")

    sd = attacker_data["status_dmg"]
    elem_set_checked(sd["under_poison"], "i_under-poison")
    elem_set_checked(sd["has_poison_tail"], "i_has-poison-tail")
    elem_set_checked(sd["under_stun"], "i_under-stun")
    elem_set_checked(sd["has_orc_hero_depo_combo"], "i_has-orc-hero-depo-combo")
    elem_set_checked(sd["has_thunder_kabuto"], "i_has-thunder-kabuto")
    elem_set_selected_index(sd["rotar_zairo_star_count"], "i_rotar-zairo-star-count")
    elem_set_checked(sd["under_freeze"], "i_under-freeze")
    elem_set_checked(sd["has_marina_depo_combo"], "i_has-marina-depo-combo")
    elem_set_checked(sd["has_garm_depo_combo"], "i_has-garm-depo-combo")
    elem_set_checked(sd["has_story_knight_combo"], "i_has-stormy-knight-combo")
    elem_set_checked(sd["under_bleed"], "i_under-bleed")
    elem_set_checked(sd["has_moonight_swing"], "i_has-moonlight-swing")
    elem_set_checked(sd["under_fear"], "i_under-fear")
    elem_set_checked(sd["under_curse"], "i_under-curse")
    elem_set_checked(sd["under_silence"], "i_under-silence")
    elem_set_checked(sd["under_darkness"], "i_under-darkness")
    elem_set_checked(sd["cursed_hand_acce1"], "i_cursed-hand_acce1")
    elem_set_checked(sd["cursed_hand_acce2"], "i_cursed-hand_acce2")
}

function save_base_defender_data() {
    defender_data = {
        "size_dec": giv("i_size-dec"),
        "defender_elem": gi("i_defender-elem").selectedIndex ,
        "elem_def": giv("i_elem-def"),
        "has_divine_carver": is_checked("i_has-divine-carver"),
        "race_dec": giv("i_race-dec"),
        "pvp_dec": giv("i_pvp-dec"),
        "defender_vit": giv("i_defender-vit"),
        "defender_def_per": giv("i_defender-def-per"),
        "defender_raw_def": giv("i_defender-raw-def"),
        "reducts_from_skill": {
            "has_energy_coat": is_checked("i_has-energy-coat"),
            "has_heart_of_steel": is_checked("i_has-heart-of-steel"),
            "has_selfess_shield": is_checked("i_has-selfless-shield"),
            "has_vanished": is_checked("i_has-vanished"),
            "has_epiclesis": is_checked("i_has-epiclesis"),
            "has_near_death_awaken": is_checked("i_has-near-death-awaken")
        },
        "dam_reduc": giv("i_dam-reduc"),
        "defender_offhand_refine": giv("i_defender_offhand-refine"),
        "defender_armor_refine": giv("i_defender_armor-refine"),
        "defender_garment_refine": giv("i_defender_garment-refine"),
        "defender_shoes_refine": giv("i_defender_shoes-refine"),
        "range_reduct": giv("i_range-reduct"),
        "skill_dmg_reduct": giv("i_skill-dmg-reduct")
    }

    return defender_data
}

function load_base_defender_data(defender_data) {
    dd = defender_data
    elem_set_value(dd["size_dec"], "i_size-dec")
    elem_set_selected_index(dd["defender_elem"], "i_defender-elem")
    elem_set_value(dd["elem_def"], "i_elem-def")
    elem_set_checked(dd["has_divine_carver"], "i_has-divine-carver")
    elem_set_value(dd["race_dec"], "i_race-dec")
    elem_set_value(dd["pvp_dec"], "i_pvp-dec")
    elem_set_value(dd["defender_vit"], "i_defender-vit")
    elem_set_value(dd["defender_def_per"], "i_defender-def-per")
    elem_set_value(dd["defender_raw_def"], "i_defender-raw-def")

    elem_set_checked(dd["has_energy_coat"], "i_has-energy-coat")
    elem_set_checked(dd["has_heart_of_steel"], "i_has-heart-of-steel")
    elem_set_checked(dd["has_selfless_shield"], "i_has-selfless-shield")
    elem_set_checked(dd["has_vanished"], "i_has-vanished")
    elem_set_checked(dd["has_epiclesis"], "i_has-epiclesis")
    elem_set_checked(dd["has_near_death_awaken"], "i_has-near-death-awaken")

    elem_set_value(dd["dam_reduc"], "i_dam-reduc")
    elem_set_value(dd["defender_offhand_refine"], "i_defender_offhand-refine")
    elem_set_value(dd["defender_armor_refine"], "i_defender_armor-refine")
    elem_set_value(dd["defender_garment_refine"], "i_defender_garment-refine")
    elem_set_value(dd["defender_shoes_refine"], "i_defender_shoes-refine")

    elem_set_value(dd["range_reduct"], "i_range-reduct")
    elem_set_value(dd["skill_dmg_reduct"], "i_skill-dmg-reduct")
}
