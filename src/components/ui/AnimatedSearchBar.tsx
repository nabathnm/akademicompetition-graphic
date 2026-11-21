/**
 * AnimatedSearchBar Component
 * Reusable Remotion UI component that simulates a complete search interaction flow:
 * typing, query suggestions, selection, submission feedback, loading, and staggered results.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import {
  Search,
  X,
  ArrowRight,
  Clock,
  Check,
  MapPin,
  Inbox,
  LucideIcon,
} from 'lucide-react';
import { AnimatedSearchBarProps } from './types.ts';
import {
  deriveSearchBarStage,
  getSearchBarMetrics,
  calculateContainerEntranceStyles,
  calculateDropdownEntranceStyles,
  calculateSuggestionItemStyles,
  calculateResultCardStyles,
  mapSearchBarVariantToInput,
} from './animatedSearchBarStyle.ts';
import { AnimatedInput } from './AnimatedInput.tsx';
import { AnimatedButton } from './AnimatedButton.tsx';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { Typography } from '../../styles/typography.ts';

export const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  value = '',
  placeholder = 'Search destinations, rides, or places...',
  suggestions = [],
  results = [],
  startFrame = 0,
  focusFrame = 10,
  typingStartFrame = 16,
  suggestionStartFrame = 28,
  selectionFrame = 48,
  selectedIndex = 0,
  submitFrame = 60,
  loadingStartFrame = 64,
  resultsStartFrame = 80,
  typingSpeed = 2,
  staggerDelay = 3,
  variant = 'outlined',
  size = 'md',
  containerEntrance = 'fade-in',
  entranceDuration = 12,
  showClearButton = true,
  showSuggestions = true,
  showResults = true,
  showSubmitButton = true,
  searchIcon,
  submitLabel = 'Search',
  emptyResultsMessage = 'No results found',
  width = '100%',
  maxWidth = 640,
  style,
  inputStyle,
  suggestionStyle,
  resultStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();

  // 1. Determine Active Interaction Stage
  const stage = deriveSearchBarStage({
    currentFrame,
    startFrame,
    focusFrame,
    typingStartFrame,
    suggestionStartFrame,
    selectionFrame,
    submitFrame,
    loadingStartFrame,
    resultsStartFrame,
  });

  // 2. Metrics & Layout Tokens
  const metrics = getSearchBarMetrics(size);
  const inputVariant = mapSearchBarVariantToInput(variant);

  // 3. Selection Resolution
  const selectedSuggestion = suggestions[selectedIndex];
  const isSelected =
    typeof selectionFrame === 'number' &&
    currentFrame >= selectionFrame &&
    Boolean(selectedSuggestion);

  // When suggestion is selected, input reflects selected suggestion text
  const effectiveInputValue = isSelected && selectedSuggestion ? selectedSuggestion.text : value;

  // 4. Container Entrance Styles
  const containerMotion = calculateContainerEntranceStyles({
    currentFrame,
    startFrame,
    entrance: containerEntrance,
    duration: entranceDuration,
    width,
    maxWidth,
  });

  // 5. Suggestions Visibility Check
  const isSuggestionsActive =
    showSuggestions &&
    suggestions.length > 0 &&
    typeof suggestionStartFrame === 'number' &&
    currentFrame >= suggestionStartFrame &&
    (resultsStartFrame === undefined || currentFrame < resultsStartFrame);

  // 6. Results Visibility Check
  const isResultsActive =
    showResults &&
    typeof resultsStartFrame === 'number' &&
    currentFrame >= resultsStartFrame;

  // Render suggestion icon helper
  const renderSuggestionIcon = (icon?: LucideIcon | React.ReactNode) => {
    if (!icon) {
      return <Clock size={metrics.iconSize - 2} color={Colors.text.tertiary} />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent size={metrics.iconSize - 2} color={Colors.text.tertiary} />;
    }
    return null;
  };

  // Render result icon helper
  const renderResultIcon = (icon?: LucideIcon | React.ReactNode) => {
    if (!icon) {
      return <MapPin size={metrics.iconSize} color={Colors.accent.brand} />;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent size={metrics.iconSize} color={Colors.accent.brand} />;
    }
    return null;
  };

  return (
    <div
      className={className}
      data-stage={stage}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: containerMotion.width,
        maxWidth: containerMotion.maxWidth,
        opacity: containerMotion.opacity,
        transform: containerMotion.transform,
        visibility: containerMotion.visibility,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* ── Search Bar Input & Submit Row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: metrics.gap,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatedInput
            value={effectiveInputValue}
            placeholder={placeholder}
            variant={inputVariant}
            size={size}
            startFrame={startFrame}
            focusFrame={focusFrame}
            typingStartFrame={typingStartFrame}
            typingSpeed={typingSpeed}
            submittedFrame={submitFrame}
            showLeadingIcon={true}
            leadingIcon={searchIcon || Search}
            showTrailingIcon={showClearButton && currentFrame >= typingStartFrame && currentFrame < (submitFrame ?? 999)}
            trailingIcon={X}
            style={{ width: '100%', ...inputStyle }}
          />
        </div>

        {showSubmitButton && (
          <div style={{ flexShrink: 0 }}>
            <AnimatedButton
              label={submitLabel}
              variant="primary"
              size={size}
              startFrame={startFrame}
              hoverFrame={submitFrame !== undefined ? submitFrame - 6 : undefined}
              pressFrame={submitFrame}
              releaseFrame={submitFrame !== undefined ? submitFrame + 4 : undefined}
              loadingStartFrame={loadingStartFrame}
              successFrame={resultsStartFrame}
              showTrailingIcon={true}
              trailingIcon={ArrowRight}
            />
          </div>
        )}
      </div>

      {/* ── Suggestions Dropdown Area ── */}
      {isSuggestionsActive && (
        <div
          data-testid="search-suggestions"
          style={{
            marginTop: metrics.dropdownOffset,
            backgroundColor: Colors.dark.surface1,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: variant === 'rounded' ? metrics.pillRadius : metrics.borderRadius,
            padding: metrics.padding,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            boxSizing: 'border-box',
            ...calculateDropdownEntranceStyles({
              currentFrame,
              startFrame: suggestionStartFrame ?? 0,
            }),
            ...suggestionStyle,
          }}
        >
          {suggestions.map((item, index) => {
            const isItemHighlighted = isSelected && index === selectedIndex;
            const itemMotion = calculateSuggestionItemStyles({
              index,
              currentFrame,
              startFrame: suggestionStartFrame ?? 0,
              staggerDelay,
              isSelected: isItemHighlighted,
            });

            return (
              <div
                key={item.id}
                data-testid={`suggestion-item-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${metrics.padding - 2}px ${metrics.padding + 4}px`,
                  borderRadius: variant === 'rounded' ? metrics.pillRadius : metrics.borderRadius - 2,
                  fontSize: metrics.fontSize - 1,
                  fontFamily: Typography.fontFamily.sans,
                  lineHeight: 1.4,
                  boxSizing: 'border-box',
                  ...itemMotion,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, minWidth: 0 }}>
                  {renderSuggestionIcon(item.icon)}
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: isItemHighlighted ? Typography.fontWeight.semibold : Typography.fontWeight.regular,
                    }}
                  >
                    {item.text}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, flexShrink: 0 }}>
                  {item.category && (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: Typography.fontFamily.mono,
                        padding: '2px 6px',
                        borderRadius: Spacing.radius.xs,
                        backgroundColor: Colors.dark.surface2,
                        color: Colors.text.tertiary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.category}
                    </span>
                  )}
                  {isItemHighlighted && (
                    <Check size={metrics.iconSize - 2} color={Colors.accent.brand} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Search Results Area ── */}
      {isResultsActive && (
        <div
          data-testid="search-results"
          style={{
            marginTop: metrics.dropdownOffset + 2,
            display: 'flex',
            flexDirection: 'column',
            gap: metrics.gap,
            width: '100%',
            boxSizing: 'border-box',
            ...resultStyle,
          }}
        >
          {results.length > 0 ? (
            results.map((result, idx) => {
              const cardMotion = calculateResultCardStyles({
                index: idx,
                currentFrame,
                resultsStartFrame: resultsStartFrame ?? 0,
                staggerDelay: staggerDelay + 1,
              });

              return (
                <div
                  key={result.id}
                  data-testid={`result-card-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: Spacing.scale.md,
                    padding: metrics.cardPadding,
                    backgroundColor: Colors.dark.surface1,
                    border: `1px solid ${Colors.border.default}`,
                    borderRadius: metrics.borderRadius,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    boxSizing: 'border-box',
                    ...cardMotion,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: metrics.height - 8,
                      height: metrics.height - 8,
                      borderRadius: Spacing.radius.sm,
                      backgroundColor: Colors.dark.surface2,
                      flexShrink: 0,
                    }}
                  >
                    {renderResultIcon(result.icon)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.scale.xs }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: metrics.fontSize,
                          fontWeight: Typography.fontWeight.semibold,
                          color: Colors.text.primary,
                          fontFamily: Typography.fontFamily.sans,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {result.title}
                      </h4>
                      {result.badge && (
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: Typography.fontFamily.mono,
                            padding: '2px 8px',
                            borderRadius: Spacing.radius.xs,
                            backgroundColor: 'rgba(39, 110, 241, 0.15)',
                            color: Colors.accent.brandLight,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                          }}
                        >
                          {result.badge}
                        </span>
                      )}
                    </div>

                    {result.description && (
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: metrics.fontSize - 2,
                          color: Colors.text.secondary,
                          fontFamily: Typography.fontFamily.sans,
                          lineHeight: 1.4,
                        }}
                      >
                        {result.description}
                      </p>
                    )}

                    {result.metadata && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          fontFamily: Typography.fontFamily.mono,
                          color: Colors.text.tertiary,
                        }}
                      >
                        {result.metadata}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State Display */
            <div
              data-testid="search-empty-state"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: Spacing.scale.xl,
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: metrics.borderRadius,
                textAlign: 'center',
                gap: Spacing.scale.xs,
                boxSizing: 'border-box',
                ...calculateResultCardStyles({
                  index: 0,
                  currentFrame,
                  resultsStartFrame: resultsStartFrame ?? 0,
                  staggerDelay: 0,
                }),
              }}
            >
              <Inbox size={28} color={Colors.text.tertiary} />
              <div
                style={{
                  fontSize: metrics.fontSize,
                  fontWeight: Typography.fontWeight.medium,
                  color: Colors.text.primary,
                  fontFamily: Typography.fontFamily.sans,
                }}
              >
                {emptyResultsMessage}
              </div>
              <span
                style={{
                  fontSize: metrics.fontSize - 2,
                  color: Colors.text.secondary,
                  fontFamily: Typography.fontFamily.sans,
                }}
              >
                Try searching for another mobility location or service.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
