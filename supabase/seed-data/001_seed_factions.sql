-- Seed data for factions table
-- Based on the Game Design Document, insert the four main factions

INSERT INTO public.factions (name, description, system_type) VALUES
(
    'Meadow Moles',
    'Provisioner faction specializing in agriculture and crafting. They transform labor and infrastructure into essential resources like food, timber, and fiber that sustain all other factions.',
    'provisioner'
),
(
    'Oakshield Badgers', 
    'Guardian faction focused on defense and stability. They use timber and food to create protection tokens and stability tokens that defend the shared project and boost other factions'' reliability.',
    'guardian'
),
(
    'Starling Scholars',
    'Mystic faction dedicated to knowledge and magic research. They convert fiber and stability into magic crystals and insight tokens that fuel rituals and enhance the efficiency of all factions.',
    'mystic'
),
(
    'River Otters',
    'Explorer faction specializing in expansion and engineering. They use timber, fiber, and magic crystals to build infrastructure and make direct progress on the shared winning project.',
    'explorer'
)
ON CONFLICT (name) DO NOTHING;