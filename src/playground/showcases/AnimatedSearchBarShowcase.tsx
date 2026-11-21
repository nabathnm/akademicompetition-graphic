/**
 * AnimatedSearchBarShowcase Component
 * Interactive showcase and diagnostic harness for the AnimatedSearchBar component.
 * Demonstrates all 5 visual variants (outlined, filled, minimal, rounded, expanded),
 * 8 sequential interaction stages (focus, typing, suggestions, selection, submission, loading, results),
 * container entrance styles, and empty state fallback.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  MapPin,
  Plane,
  Building,
  Car,
  Clock,
  Navigation,
  Utensils,
  Search,
} from 'lucide-react';
import { AnimatedSearchBar } from '../../components/ui/AnimatedSearchBar';
import {
  AnimatedSearchBarVariant,
  AnimatedSearchBarSize,
  AnimatedSearchBarContainerEntrance,
  SearchSuggestion,
  SearchResult,
} from '../../components/ui/types';
import { deriveSearchBarStage } from '../../components/ui/animatedSearchBarStyle';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const SAMPLE_SUGGESTIONS: SearchSuggestion[] = [
  { id: 's1', text: 'San Francisco International Airport (SFO)', category: 'Airport', icon: Plane },
  { id: 's2', text: 'Salesforce Tower, Mission St', category: 'Commercial', icon: Building },
  { id: 's3', text: 'Ferry Building Marketplace', category: 'Destination', icon: MapPin },
  { id: 's4', text: 'Union Square Shopping Plaza', category: 'Retail', icon: Navigation },
];

const SAMPLE_RESULTS: SearchResult[] = [
  {
    id: 'r1',
    title: 'SFO Terminal 2 - Departures Level',
    description: 'Direct curb drop-off for Alaska & Delta Airlines',
    category: 'Airport Terminal',
    badge: '18 min · $42.50',
    icon: Plane,
    metadata: 'Fastest route via US-101 S · Low traffic',
  },
  {
    id: 'r2',
    title: 'SFO International Terminal A',
    description: 'International departures curb and priority valet',
    category: 'International Flights',
    badge: '22 min · $46.00',
    icon: Car,
    metadata: 'Via I-280 S and I-380 E',
  },
  {
    id: 'r3',
    title: 'SFO Long-Term Parking & AirTrain',
    description: 'Shuttle stop and AirTrain red line connector',
    category: 'Transit & Parking',
    badge: '25 min · $38.00',
    icon: Clock,
    metadata: 'South McDonnell Rd · Lot D',
  },
];

const EATS_SUGGESTIONS: SearchSuggestion[] = [
  { id: 'e1', text: 'Blue Bottle Coffee - Mint Plaza', category: 'Café', icon: Utensils },
  { id: 'e2', text: 'Tartine Manufactory - Mission', category: 'Bakery', icon: Utensils },
  { id: 'e3', text: 'Rintaro Japanese Izakaya', category: 'Dinner', icon: Utensils },
];

const EATS_RESULTS: SearchResult[] = [
  {
    id: 'er1',
    title: 'Blue Bottle Coffee',
    description: 'Single-origin espresso, New Orleans iced coffee, and fresh pastries',
    badge: '4.9 ★ · 15-25 min',
    icon: Utensils,
    metadata: 'Free delivery on orders over $25 · Uber One',
  },
  {
    id: 'er2',
    title: 'Tartine Manufactory',
    description: 'Artisanal sourdough bread, morning buns, and seasonal breakfast sandwiches',
    badge: '4.8 ★ · 20-35 min',
    icon: Utensils,
    metadata: 'Popular with locals · Mission District',
  },
];

export const AnimatedSearchBarShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [queryValue, setQueryValue] = useState<string>('San Francisco Airport');
  const [selectedVariant, setSelectedVariant] = useState<AnimatedSearchBarVariant>('outlined');
  const [selectedSize, setSelectedSize] = useState<AnimatedSearchBarSize>('md');
  const [entranceStyle, setEntranceStyle] = useState<AnimatedSearchBarContainerEntrance>('fade-in');
  const [showSubmit, setShowSubmit] = useState<boolean>(true);
  const [showSuggestionsToggle, setShowSuggestionsToggle] = useState<boolean>(true);
  const [showResultsToggle, setShowResultsToggle] = useState<boolean>(true);

  // Derive active stage for telemetry
  const activeStage = deriveSearchBarStage({
    currentFrame,
    startFrame: 0,
    focusFrame: 10,
    typingStartFrame: 16,
    suggestionStartFrame: 28,
    selectionFrame: 48,
    submitFrame: 60,
    loadingStartFrame: 64,
    resultsStartFrame: 80,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
        width: '100%',
        color: Colors.text.primary,
        fontFamily: Typography.fontFamily.sans,
      }}
    >
      {/* SECTION 1: Telemetry Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          fontFamily: Typography.fontFamily.mono,
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>● ANIMATED SEARCH BAR SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>
            STAGE: <strong style={{ color: Colors.accent.cyan, textTransform: 'uppercase' }}>{activeStage}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.scale.md }}>
          <span>FRAME: <strong style={{ color: Colors.accent.cyan }}>{currentFrame} / {durationInFrames}</strong></span>
          <span>TIMECODE: <strong style={{ color: Colors.accent.amber }}>{formatTimecode(currentFrame, fps)}</strong></span>
        </div>
      </div>

      {/* SECTION 2: Interactive Playground Sandbox */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.lg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.scale.sm }}>
          <div>
            <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
              Interactive Search Engine Sandbox
            </h3>
            <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
              Frame-accurate simulation of user typing, suggestion discovery, selection, submission, and result staggering.
            </p>
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.accent.emerald,
              border: `1px solid ${Colors.border.subtle}`,
            }}
          >
            ● COMPOSABLE UI LAYER
          </span>
        </div>

        {/* Controls Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: Spacing.scale.md,
            padding: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
          }}
        >
          {/* Query String Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TARGET SEARCH QUERY
            </label>
            <input
              type="text"
              value={queryValue}
              onChange={(e) => setQueryValue(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 13,
                fontFamily: Typography.fontFamily.sans,
              }}
            />
          </div>

          {/* Visual Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VISUAL VARIANT
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(['outlined', 'filled', 'minimal', 'rounded', 'expanded'] as AnimatedSearchBarVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedVariant === v ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedVariant === v ? Colors.accent.brand : Colors.border.default}`,
                    color: selectedVariant === v ? '#FFF' : Colors.text.secondary,
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: selectedVariant === v ? 700 : 400,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SIZE PRESET
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['sm', 'md', 'lg'] as AnimatedSearchBarSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedSize === sz ? Colors.accent.cyan : Colors.dark.surface3,
                    border: `1px solid ${selectedSize === sz ? Colors.accent.cyan : Colors.border.default}`,
                    color: selectedSize === sz ? '#000' : Colors.text.secondary,
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Container Entrance Style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              CONTAINER ENTRANCE
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(['fade-in', 'slide-in', 'scale-in', 'expand-width', 'none'] as AnimatedSearchBarContainerEntrance[]).map((ent) => (
                <button
                  key={ent}
                  onClick={() => setEntranceStyle(ent)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: entranceStyle === ent ? Colors.accent.electricViolet : Colors.dark.surface3,
                    border: `1px solid ${entranceStyle === ent ? Colors.accent.electricViolet : Colors.border.default}`,
                    color: entranceStyle === ent ? '#FFF' : Colors.text.secondary,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  {ent}
                </button>
              ))}
            </div>
          </div>

          {/* Element Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DISPLAY TOGGLES
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowSubmit(!showSubmit)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: showSubmit ? Colors.accent.emerald : Colors.dark.surface3,
                  border: `1px solid ${showSubmit ? Colors.accent.emerald : Colors.border.default}`,
                  color: showSubmit ? '#FFF' : Colors.text.tertiary,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Submit: {showSubmit ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setShowSuggestionsToggle(!showSuggestionsToggle)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: showSuggestionsToggle ? Colors.accent.emerald : Colors.dark.surface3,
                  border: `1px solid ${showSuggestionsToggle ? Colors.accent.emerald : Colors.border.default}`,
                  color: showSuggestionsToggle ? '#FFF' : Colors.text.tertiary,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Suggestions: {showSuggestionsToggle ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setShowResultsToggle(!showResultsToggle)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: showResultsToggle ? Colors.accent.emerald : Colors.dark.surface3,
                  border: `1px solid ${showResultsToggle ? Colors.accent.emerald : Colors.border.default}`,
                  color: showResultsToggle ? '#FFF' : Colors.text.tertiary,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Results: {showResultsToggle ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Sandbox Preview */}
        <div
          style={{
            padding: Spacing.scale.xl,
            backgroundColor: Colors.black,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: 380,
          }}
        >
          <AnimatedSearchBar
            value={queryValue}
            placeholder="Search airport, location, or hotel..."
            suggestions={showSuggestionsToggle ? SAMPLE_SUGGESTIONS : []}
            results={showResultsToggle ? SAMPLE_RESULTS : []}
            startFrame={0}
            focusFrame={10}
            typingStartFrame={16}
            suggestionStartFrame={28}
            selectionFrame={48}
            selectedIndex={0}
            submitFrame={60}
            loadingStartFrame={64}
            resultsStartFrame={80}
            typingSpeed={2}
            staggerDelay={3}
            variant={selectedVariant}
            size={selectedSize}
            containerEntrance={entranceStyle}
            showSubmitButton={showSubmit}
            showSuggestions={showSuggestionsToggle}
            showResults={showResultsToggle}
            showClearButton={true}
            maxWidth={580}
          />
        </div>
      </div>

      {/* SECTION 3: Visual Variants Comparison Matrix */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Visual Variants Architecture
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Five distinct styling variants engineered for modern mobility dashboards, editorial hero searches, and minimal navigation overlays.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { variant: 'outlined', label: '1. Outlined', desc: 'High-contrast boundary with glowing focus ring' },
            { variant: 'rounded', label: '2. Rounded (Pill)', desc: 'Mobile-style full border radius with integrated submit button' },
            { variant: 'filled', label: '3. Filled', desc: 'Elevated dark surface (surface2) for content canvases' },
            { variant: 'minimal', label: '4. Minimal', desc: 'Transparent backdrop with subtle dividing baseline' },
            { variant: 'expanded', label: '5. Expanded', desc: 'Smooth horizontal expansion entrance from center' },
          ].map((item) => (
            <div
              key={item.variant}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
                padding: Spacing.scale.md,
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: Colors.accent.brandLight }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                  variant="{item.variant}"
                </span>
              </div>
              <span style={{ fontSize: 11, color: Colors.text.secondary, marginBottom: 4 }}>
                {item.desc}
              </span>

              <div
                style={{
                  padding: Spacing.scale.md,
                  backgroundColor: Colors.black,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <AnimatedSearchBar
                  value="Downtown San Francisco"
                  placeholder="Where to?"
                  variant={item.variant as AnimatedSearchBarVariant}
                  size="sm"
                  startFrame={0}
                  focusFrame={8}
                  typingStartFrame={14}
                  suggestionStartFrame={999} // keep compact in preview card
                  resultsStartFrame={999}
                  showSubmitButton={true}
                  maxWidth="100%"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Realistic Commercial Interaction Flows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.lg,
        }}
      >
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Commercial Application Scenarios
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Real-world product walkthroughs simulating on-demand ride booking, delivery discovery, and zero-state handling.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: Spacing.scale.lg,
          }}
        >
          {/* Scenario A: On-Demand Food & Delivery */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.lg,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
                  SCENARIO A: UBER EATS DELIVERY DISCOVERY
                </span>
                <h4 style={{ margin: '4px 0 0 0', color: Colors.text.primary, fontSize: 16 }}>
                  Café & Bakery Live Search
                </h4>
              </div>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                timeline: 0-90f
              </span>
            </div>

            <div
              style={{
                padding: Spacing.scale.lg,
                backgroundColor: Colors.black,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.subtle}`,
                minHeight: 280,
              }}
            >
              <AnimatedSearchBar
                value="Artisanal Bakery"
                placeholder="Search food, groceries, or drinks..."
                suggestions={EATS_SUGGESTIONS}
                results={EATS_RESULTS}
                startFrame={0}
                focusFrame={8}
                typingStartFrame={14}
                suggestionStartFrame={24}
                selectionFrame={44}
                selectedIndex={1}
                submitFrame={54}
                loadingStartFrame={58}
                resultsStartFrame={72}
                variant="rounded"
                size="md"
                submitLabel="Order"
                searchIcon={Search}
              />
            </div>
          </div>

          {/* Scenario B: Zero Results Fallback Handling */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.lg,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
                  SCENARIO B: EMPTY STATE VALIDATION
                </span>
                <h4 style={{ margin: '4px 0 0 0', color: Colors.text.primary, fontSize: 16 }}>
                  Graceful Zero Results Fallback
                </h4>
              </div>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                results: []
              </span>
            </div>

            <div
              style={{
                padding: Spacing.scale.lg,
                backgroundColor: Colors.black,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.subtle}`,
                minHeight: 280,
              }}
            >
              <AnimatedSearchBar
                value="Atlantis Underwater Resort"
                placeholder="Search any destination..."
                suggestions={[]}
                results={[]}
                startFrame={0}
                focusFrame={6}
                typingStartFrame={12}
                submitFrame={36}
                loadingStartFrame={40}
                resultsStartFrame={56}
                variant="outlined"
                size="md"
                emptyResultsMessage="No mobility pickup locations available"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
