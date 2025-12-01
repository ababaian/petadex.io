import React, { useEffect, useRef, useState } from "react";
import config from "../config";

const ProteinViewer = ({ accession, width = "100%", height = "100%" }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accession || typeof window === 'undefined') return;

    let viewer = null;
    let isMounted = true;

    const loadStructure = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading structure for:', accession);

        // Load 3Dmol from CDN if not already loaded
        if (!window.$3Dmol) {
          console.log('Loading 3Dmol from CDN...');
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://3dmol.org/build/3Dmol-min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          console.log('3Dmol loaded from CDN');
        } else {
          console.log('3Dmol already available');
        }

        const $3Dmol = window.$3Dmol;
        console.log('Using $3Dmol:', typeof $3Dmol);

        // Get PDB info from backend
        const pdbUrl = `${config.apiUrl}/pdb/accession/${accession}`;
        console.log('Fetching PDB info from:', pdbUrl);

        const response = await fetch(pdbUrl);

        if (!response.ok) {
          throw new Error('No structure available');
        }

        const pdbInfo = await response.json();
        console.log('PDB info received:', pdbInfo);

        if (!isMounted) {
          console.log('Component unmounted, aborting');
          return;
        }

        console.log('Container ref:', containerRef.current);
        console.log('Is mounted:', isMounted);

        // Initialize 3Dmol viewer
        if (containerRef.current) {
          console.log('Creating viewer in container:', containerRef.current);
          viewer = $3Dmol.createViewer(containerRef.current, {
            backgroundColor: 'white',
          });
          console.log('Viewer created:', viewer);

          // Fetch and display PDB file
          console.log('Fetching PDB file from:', pdbInfo.pdb_url);
          const pdbResponse = await fetch(pdbInfo.pdb_url);
          if (!pdbResponse.ok) {
            throw new Error(`Failed to load PDB file: ${pdbResponse.status}`);
          }

          const pdbData = await pdbResponse.text();
          console.log('PDB data loaded, length:', pdbData.length);

          if (!isMounted) return;

          viewer.addModel(pdbData, "pdb");
          viewer.setStyle({}, { cartoon: { color: 'spectrum' } });

          // Center the structure first
          viewer.zoomTo();

          // Then apply consistent zoom level based on container size
          // For small containers (featured cards 80px), zoom out more to show full structure
          // For large containers (detail page 500px), zoom out less
          const containerHeight = containerRef.current.offsetHeight;
          let zoomFactor;
          if (containerHeight < 150) {
            zoomFactor = 0.5; // Small cards - zoom way out
          } else if (containerHeight < 300) {
            zoomFactor = 0.7; // Medium - zoom out moderately
          } else {
            zoomFactor = 0.85; // Large - zoom out just a bit
          }

          console.log('Container height:', containerHeight, 'Zoom factor:', zoomFactor);
          viewer.zoom(zoomFactor, 0); // 0 = no animation

          viewer.render();
          viewerRef.current = viewer;
          console.log('Structure rendered successfully');
        } else {
          console.error('Container ref is null! Cannot create viewer');
          throw new Error('Container not available');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading structure:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadStructure();

    return () => {
      isMounted = false;
      if (viewerRef.current) {
        // Cleanup viewer if needed
        viewerRef.current = null;
      }
    };
  }, [accession]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {/* Always render the viewer container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />

      {/* Overlay loading/error messages */}
      {loading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            fontSize: '0.875rem',
            zIndex: 10
          }}
        >
          Loading structure...
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            color: '#94a3b8',
            fontSize: '0.75rem',
            textAlign: 'center',
            padding: '0.5rem',
            zIndex: 10
          }}
        >
          Structure unavailable
        </div>
      )}
    </div>
  );
};

export default ProteinViewer;
