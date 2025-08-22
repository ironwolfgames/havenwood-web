-- Seed data for shared_projects table
-- This script populates the shared projects from the Game Design Document

INSERT INTO public.shared_projects (name, description, stages) VALUES
(
    'Sky Lantern of Eternal Dawn',
    'Illuminate the land to hold back encroaching darkness. This massive lantern will provide eternal light to protect all kingdoms from the shadow plague.',
    '[
        {
            "stage": 1,
            "name": "Craft the Lantern Frame",
            "description": "Build the basic structure using timber and magical components.",
            "requirements": {
                "timber": 15,
                "magic_crystals": 8,
                "infrastructure_tokens": 5
            }
        },
        {
            "stage": 2,
            "name": "Enchant the Light Crystal",
            "description": "Imbue the central crystal with protective magic and insights.",
            "requirements": {
                "magic_crystals": 20,
                "insight_tokens": 12,
                "stability_tokens": 8
            }
        },
        {
            "stage": 3,
            "name": "Raise the Lantern",
            "description": "Install the completed lantern and activate its eternal flame.",
            "requirements": {
                "infrastructure_tokens": 15,
                "protection_tokens": 10,
                "project_progress": 25
            }
        }
    ]'::jsonb
),
(
    'Heartwood Tree Restoration',
    'Revive the central life-giving tree that once nourished all the kingdoms. Its restoration will bring abundance and healing to the land.',
    '[
        {
            "stage": 1,
            "name": "Clear the Corrupted Roots",
            "description": "Remove dark corruption from the ancient root system.",
            "requirements": {
                "protection_tokens": 12,
                "stability_tokens": 10,
                "magic_crystals": 8
            }
        },
        {
            "stage": 2,
            "name": "Replant Sacred Seeds",
            "description": "Plant blessed seeds and nurture new growth with care.",
            "requirements": {
                "food": 25,
                "fiber": 15,
                "insight_tokens": 10
            }
        },
        {
            "stage": 3,
            "name": "Perform the Great Awakening",
            "description": "Channel collective energy to awaken the Heartwood Tree.",
            "requirements": {
                "magic_crystals": 18,
                "infrastructure_tokens": 12,
                "project_progress": 30
            }
        }
    ]'::jsonb
),
(
    'Crystal Bridge Across the Chasm',
    'Reconnect isolated kingdoms by spanning the Great Chasm with a magnificent crystal bridge powered by cooperative magic.',
    '[
        {
            "stage": 1,
            "name": "Anchor the Foundation",
            "description": "Secure crystal anchors on both sides of the chasm.",
            "requirements": {
                "timber": 20,
                "infrastructure_tokens": 15,
                "protection_tokens": 8
            }
        },
        {
            "stage": 2,
            "name": "Weave the Crystal Spans",
            "description": "Use magic and engineering to create the bridge structure.",
            "requirements": {
                "magic_crystals": 25,
                "fiber": 18,
                "insight_tokens": 12
            }
        },
        {
            "stage": 3,
            "name": "Harmonize the Resonance",
            "description": "Tune the bridge''s crystal matrix for safe passage.",
            "requirements": {
                "stability_tokens": 15,
                "infrastructure_tokens": 20,
                "project_progress": 28
            }
        }
    ]'::jsonb
),
(
    'Moon Temple Ritual',
    'Seal away corruption with a massive magical ritual performed at the ancient Moon Temple, requiring perfect coordination of all factions.',
    '[
        {
            "stage": 1,
            "name": "Restore the Temple Grounds",
            "description": "Repair the ancient structures and clear the ritual space.",
            "requirements": {
                "timber": 18,
                "infrastructure_tokens": 12,
                "stability_tokens": 10
            }
        },
        {
            "stage": 2,
            "name": "Gather Ritual Components",
            "description": "Collect rare materials and prepare ceremonial items.",
            "requirements": {
                "fiber": 20,
                "magic_crystals": 22,
                "insight_tokens": 15
            }
        },
        {
            "stage": 3,
            "name": "Perform the Sealing Ritual",
            "description": "Channel the power of all factions to seal the corruption.",
            "requirements": {
                "protection_tokens": 18,
                "magic_crystals": 15,
                "project_progress": 35
            }
        }
    ]'::jsonb
),
(
    'Skyship Ark',
    'Build an airship to evacuate the kingdoms to safety in the floating islands above the clouds, preserving civilization for the future.',
    '[
        {
            "stage": 1,
            "name": "Construct the Hull",
            "description": "Build the main body of the skyship with reinforced timber.",
            "requirements": {
                "timber": 30,
                "fiber": 20,
                "infrastructure_tokens": 18
            }
        },
        {
            "stage": 2,
            "name": "Install Flight Systems",
            "description": "Add magical propulsion and navigation systems.",
            "requirements": {
                "magic_crystals": 28,
                "insight_tokens": 18,
                "stability_tokens": 12
            }
        },
        {
            "stage": 3,
            "name": "Launch the Ark",
            "description": "Power up all systems and launch to the safety of the sky.",
            "requirements": {
                "protection_tokens": 15,
                "infrastructure_tokens": 25,
                "project_progress": 40
            }
        }
    ]'::jsonb
);