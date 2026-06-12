import { useFrame } from "@react-three/fiber";

import { useMemo, useRef } from "react";

import * as THREE from "three";

import { useScrollExperience } from "../../context/ScrollExperienceContext";

import { isInSection } from "../../constants/scrollSections";

import { getFloralState } from "../../utils/scrollChoreography";



const COUNT = 360;

const NOTES_COUNT = 520;
const NOTES_MIST_WIDTH = 0.38;
const NOTES_MIST_DEPTH = 0.2;



/** Narrow rising stream for screen 3 (Popular). */

function PopularStream() {

  const pointsRef = useRef<THREE.Points>(null);

  const { progress, isMobile, lowPerformance } = useScrollExperience();

  const count = lowPerformance || isMobile ? COUNT / 2 : COUNT;



  const geometry = useMemo(() => {

    const positions = new Float32Array(count * 3);

    const seeds = new Float32Array(count);



    for (let i = 0; i < count; i += 1) {

      const i3 = i * 3;

      const angle = Math.random() * Math.PI * 2;

      const radius = Math.random() * 0.12;

      positions[i3] = Math.cos(angle) * radius;

      positions[i3 + 1] = Math.random() * 2.5 - 0.5;

      positions[i3 + 2] = Math.sin(angle) * radius;

      seeds[i] = Math.random();

    }



    const geo = new THREE.BufferGeometry();

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    return geo;

  }, [count]);



  const material = useMemo(

    () =>

      new THREE.PointsMaterial({

        color: "#f5edd6",

        size: 0.035,

        transparent: true,

        opacity: 0.7,

        blending: THREE.AdditiveBlending,

        depthWrite: false,

        sizeAttenuation: true

      }),

    []

  );



  useFrame((state) => {

    const points = pointsRef.current;

    if (!points) return;



    const floral = getFloralState(progress, state.clock.elapsedTime);

    const inStream =
      isInSection(progress, "POPULAR") ||
      isInSection(progress, "HERITAGE") ||
      isInSection(progress, "CRAFT") ||
      isInSection(progress, "RITUAL");

    const intensity = inStream ? floral.streamIntensity : 0;

    points.visible = intensity > 0.02;



    const mat = points.material as THREE.PointsMaterial;

    mat.opacity = intensity * 0.75;



    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;

    const seeds = geometry.getAttribute("aSeed") as THREE.BufferAttribute;



    for (let i = 0; i < count; i += 1) {

      const seed = seeds.getX(i);

      let y = pos.getY(i);

      y += 0.012 + seed * 0.008;

      if (y > 2.2) y = -0.4 - Math.random() * 0.3;

      pos.setY(i, y);

      pos.setX(i, pos.getX(i) + Math.sin(state.clock.elapsedTime * 2 + seed * 10) * 0.001);

    }

    pos.needsUpdate = true;

  });



  return (

    <points

      ref={pointsRef}

      geometry={geometry}

      material={material}

      position={[0, -0.65, -0.4]}

      renderOrder={0}

    />

  );

}



/** Narrow mist column rising behind the floral focal on screen 4 (Notes). */

function NotesRiseMist() {

  const pointsRef = useRef<THREE.Points>(null);

  const { progress, isMobile, lowPerformance } = useScrollExperience();

  const count = lowPerformance || isMobile ? NOTES_COUNT / 2 : NOTES_COUNT;



  const geometry = useMemo(() => {

    const positions = new Float32Array(count * 3);

    const seeds = new Float32Array(count);



    for (let i = 0; i < count; i += 1) {

      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 3.2;

      positions[i3 + 1] = -2.4 + Math.random() * 0.6;

      positions[i3 + 2] = (Math.random() - 0.5) * 1.2 - 0.3;

      seeds[i] = Math.random();

    }



    const geo = new THREE.BufferGeometry();

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    return geo;

  }, [count]);



  const material = useMemo(

    () =>

      new THREE.PointsMaterial({

        color: "#f0e8d8",

        size: 0.055,

        transparent: true,

        opacity: 0.55,

        blending: THREE.AdditiveBlending,

        depthWrite: false,

        sizeAttenuation: true

      }),

    []

  );



  useFrame((state) => {

    const points = pointsRef.current;

    if (!points) return;



    const inMist = isInSection(progress, "NOTES");

    const floral = getFloralState(progress, state.clock.elapsedTime);

    const intensity = inMist ? Math.max(0.5, floral.smokeIntensity) : 0;

    points.visible = intensity > 0.02;



    const mat = points.material as THREE.PointsMaterial;

    mat.opacity = intensity * 0.65;



    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;

    const seeds = geometry.getAttribute("aSeed") as THREE.BufferAttribute;



    for (let i = 0; i < count; i += 1) {

      const seed = seeds.getX(i);

      let y = pos.getY(i);

      y += 0.018 + seed * 0.012;

      if (y > 3.2) {

        const i3 = i * 3;

        pos.setX(i, (Math.random() - 0.5) * NOTES_MIST_WIDTH);

        pos.setZ(i, (Math.random() - 0.5) * NOTES_MIST_DEPTH - 0.3);

        y = -2.5 - Math.random() * 0.5;

      }

      pos.setY(i, y);

      pos.setX(i, pos.getX(i) + Math.sin(state.clock.elapsedTime * 1.5 + seed * 8) * 0.003);

    }

    pos.needsUpdate = true;

  });



  return (

    <points

      ref={pointsRef}

      geometry={geometry}

      material={material}

      position={[0, 0, -0.55]}

      renderOrder={-1}

    />

  );

}



export default function ScentStream() {

  return (

    <>

      <PopularStream />

      <NotesRiseMist />

    </>

  );

}


