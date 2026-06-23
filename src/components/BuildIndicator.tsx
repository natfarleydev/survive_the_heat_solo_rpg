export default function BuildIndicator() {
  // Show build version based on commit/deployment
  const buildVersion = import.meta.env.VITE_BUILD_VERSION || 'v1.0';
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="build-indicator" title={`Built: ${buildTime}`}>
      🏗️ {buildVersion}
    </div>
  );
}
