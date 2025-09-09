# Petadex Database Schema

This document describes the database schema for the Petadex biological sequence storage system.

## Overview
Petadex stores FASTA format biological sequences with metadata for research and analysis purposes.

## Tables

### FASTAA Table
Primary table for storing biological sequence data in FASTA format.

<<<-fastaa->>>

## Data Flow
1. Sequences are submitted with accession numbers
2. Each sequence includes source information for traceability  
3. Timestamps track when sequences were entered into the system
4. Accession numbers serve as unique identifiers following standard biological nomenclature