// Import images
import tirelireSprite from '@/assets/tirelire/images/Tirelire.png';
import background from '@/assets/tirelire/images/background.png';

// Good pictograms
import hopital from '@/assets/tirelire/images/pictos_bons/Hopital.png';
import auditive from '@/assets/tirelire/images/pictos_bons/AideAuditive.png';
import dentiste from '@/assets/tirelire/images/pictos_bons/Dentiste.png';
import medecin from '@/assets/tirelire/images/pictos_bons/Medecin.png';
import optique from '@/assets/tirelire/images/pictos_bons/Optique.png';
import transport from '@/assets/tirelire/images/pictos_bons/TransportSanitaire.png';

// Bad pictograms
import ampoule from '@/assets/tirelire/images/pictos_faux/ampoule.png';
import courrier from '@/assets/tirelire/images/pictos_faux/courrier.png';
import etude from '@/assets/tirelire/images/pictos_faux/etude.png';
import livre from '@/assets/tirelire/images/pictos_faux/livre.png';
import maison from '@/assets/tirelire/images/pictos_faux/maison.png';
import puzzle from '@/assets/tirelire/images/pictos_faux/puzzle.png';
import telephone from '@/assets/tirelire/images/pictos_faux/telephone.png';

// Jauge
import jauge0 from '@/assets/tirelire/images/jauges/jauge0.png';
import jauge1 from '@/assets/tirelire/images/jauges/jauge1.png';
import jauge2 from '@/assets/tirelire/images/jauges/jauge2.png';
import jauge3 from '@/assets/tirelire/images/jauges/jauge3.png';
import jauge4 from '@/assets/tirelire/images/jauges/jauge4.png';

// Sounds
import goodSound from '@/assets/tirelire/sons/good.mp3';
import wrongSound from '@/assets/tirelire/sons/wrong.mp3';
import clap from '@/assets/tirelire/sons/clap.mp3';

const goodPictograms = [
    { key: 'hopital', image: hopital },
    { key: 'auditive', image: auditive },
    { key: 'dentiste', image: dentiste },
    { key: 'medecin', image: medecin },
    { key: 'optique', image: optique },
    { key: 'transport', image: transport },
];

const badPictograms = [ampoule, courrier, etude, livre, maison, puzzle, telephone];

export function preloadAssets(scene) {
    scene.load.image('tirelire', tirelireSprite);
    scene.load.image('background', background);

    goodPictograms.forEach((picto) => scene.load.image(picto.key, picto.image));

    badPictograms.forEach((picto, index) => scene.load.image(`bad${index}`, picto));

    scene.load.image('jauge0', jauge0);
    scene.load.image('jauge1', jauge1);
    scene.load.image('jauge2', jauge2);
    scene.load.image('jauge3', jauge3);
    scene.load.image('jauge4', jauge4);

    scene.load.audio('goodSound', goodSound);
    scene.load.audio('wrongSound', wrongSound);
    scene.load.audio('clap', clap);
}

export const assets = {
    goodPictograms,
    badPictograms,
};