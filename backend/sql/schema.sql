-- Petadex Database Schema
-- Table for storing biological sequence data (FASTA format)

CREATE TABLE IF NOT EXISTS fastaa (
    accession character varying(32) NOT NULL,
    sequence character varying,
    source character varying,
    test_bug character varying,
    date_entered timestamp with time zone DEFAULT now()
);

ALTER TABLE ONLY fastaa
    ADD CONSTRAINT accession_sequences_pkey PRIMARY KEY (accession);

-- Add some sample data for testing (optional)
-- INSERT INTO fastaa (accession, sequence, source) VALUES 
-- ('TEST001', 'ATCGATCGATCG', 'test_source');