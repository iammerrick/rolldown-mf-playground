import React, { useState } from 'react';
import { RolldownConfig } from '../types/config';

interface ConfigPanelProps {
  config: RolldownConfig;
  onConfigChange: (config: RolldownConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExternalChange = (value: string) => {
    const external = value.split('\n').filter(line => line.trim());
    onConfigChange({ ...config, external });
  };

  const handleConfigUpdate = (key: keyof RolldownConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#24292f',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: isExpanded ? '#e1f5fe' : 'transparent'
        }}
        title="Configuration"
      >
        <span>⚙️</span>
        Config
        <span style={{ 
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          width: '400px',
          backgroundColor: '#ffffff',
          border: '1px solid #d0d7de',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(140, 149, 159, 0.2)',
          zIndex: 1000,
          padding: '16px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '16px', 
            fontWeight: 600,
            color: '#24292f'
          }}>
            Rolldown Configuration
          </h3>

          {/* Input Options Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '14px', 
              fontWeight: 600,
              color: '#656d76'
            }}>
              Input Options
            </h4>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: 500,
                marginBottom: '4px',
                color: '#24292f'
              }}>
                External Dependencies
              </label>
              <textarea
                value={config.external.join('\n')}
                onChange={(e) => handleExternalChange(e.target.value)}
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '6px 8px',
                  border: '1px solid #d0d7de',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
                placeholder="react&#10;react-dom&#10;..."
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  marginBottom: '4px',
                  color: '#24292f'
                }}>
                  Format
                </label>
                <select
                  value={config.format}
                  onChange={(e) => handleConfigUpdate('format', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d0d7de',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="es">ES Module</option>
                  <option value="cjs">CommonJS</option>
                  <option value="iife">IIFE</option>
                  <option value="umd">UMD</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  marginBottom: '4px',
                  color: '#24292f'
                }}>
                  Platform
                </label>
                <select
                  value={config.platform}
                  onChange={(e) => handleConfigUpdate('platform', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d0d7de',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="browser">Browser</option>
                  <option value="node">Node.js</option>
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '12px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={config.minify}
                  onChange={(e) => handleConfigUpdate('minify', e.target.checked)}
                  style={{ margin: 0, cursor: 'pointer' }}
                />
                Minify
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={config.sourcemap}
                  onChange={(e) => handleConfigUpdate('sourcemap', e.target.checked)}
                  style={{ margin: 0, cursor: 'pointer' }}
                />
                Sourcemap
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={config.treeshake}
                  onChange={(e) => handleConfigUpdate('treeshake', e.target.checked)}
                  style={{ margin: 0, cursor: 'pointer' }}
                />
                Treeshake
              </label>
            </div>
          </div>

          {/* Output Options Section */}
          <div>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '14px', 
              fontWeight: 600,
              color: '#656d76'
            }}>
              Output Options
            </h4>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                fontWeight: 500,
                marginBottom: '4px',
                color: '#24292f'
              }}>
                Output Directory
              </label>
              <input
                type="text"
                value={config.dir}
                onChange={(e) => handleConfigUpdate('dir', e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  border: '1px solid #d0d7de',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                placeholder="dist"
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  marginBottom: '4px',
                  color: '#24292f'
                }}>
                  Entry File Names
                </label>
                <input
                  type="text"
                  value={config.entryFileNames}
                  onChange={(e) => handleConfigUpdate('entryFileNames', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d0d7de',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="[name].js"
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: 500,
                  marginBottom: '4px',
                  color: '#24292f'
                }}>
                  Chunk File Names
                </label>
                <input
                  type="text"
                  value={config.chunkFileNames}
                  onChange={(e) => handleConfigUpdate('chunkFileNames', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d0d7de',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="[name]-[hash].js"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
