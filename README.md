# YatraSetu — Unified Tourism Discovery & Travel Intelligence

YatraSetu is an AI-powered travel intelligence platform designed for road travelers, tourists, and destination communities. It unifies destination discovery, route readiness, safety intelligence, nearby emergency services, AI recommendations, flexible itineraries, and community feedback into a single seamless experience.

## Key Features
- **Google OAuth Authentication**: Fast, secure login with automatic profile synchronization.
- **Immediate Location Request & Manual Fallback**: Prompt GPS permission with an intuitive manual fallback.
- **Vehicle-Aware Travel Planning**: Custom routing and recommendations tailored for Cars, Bikes, SUVs, and Buses.
- **AI Recommendation Engine**: 100km radius candidate discovery with AI-justified expansion, multi-factor scoring (0-100%), and human-readable explanations.
- **Interactive Route & Safety Maps**: Visual route display with emergency service markers (Fuel Stations, Mechanics, Hospitals).
- **Safety & Infrastructure Intelligence**: Road conditions, terrain hazard warnings, and emergency contact lists.
- **Community Hub & Reviews**: Multi-category destination ratings, written reviews, popular-first community feed, text/image posts, and comments.
- **Flexible AI Itineraries**: Day-by-day suggested itineraries for any user-entered trip duration.
- **Bus Booking Integration**: Direct external booking redirects for bus travelers.

## Architecture
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Accessible UI tokens
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **External Integrations**: Google Maps Platform / Places API & AI Provider with resilient fallback adapters
- **Testing**: Node.js automated test runner for schema validation, pipeline logic, API handlers, and RLS policies.
