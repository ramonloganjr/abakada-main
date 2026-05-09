// Re-exports the global comparison context as a hook
// All components call useComparison() — state is shared via ComparisonProvider
export { useComparisonContext as useComparison } from '../contexts/ComparisonContext'
