import React, { useState } from 'react';
import { Download, Database, RowsIcon, Sparkles, Zap, ChevronDown } from 'lucide-react';

interface DataRow {
  [key: string]: string | number;
}

function App() {
  const [description, setDescription] = useState('');
  const [rowCount, setRowCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedData, setGeneratedData] = useState<DataRow[]>([]);
  const [csvData, setCsvData] = useState<string>('');
  const [error, setError] = useState<string>('');


  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: description,
          row: rowCount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate data');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedData(result.jsonData);
      setCsvData(result.csvData);
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setHasGenerated(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = () => {
    if (!csvData) return;

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `synthetic-data-${rowCount}-rows.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetGeneration = () => {
    setHasGenerated(false);
    setGeneratedData([]);
    setCsvData('');
    setError('');
    setDescription('');
    setRowCount(10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl mb-6 shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
            Synthetic Data
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <p className="text-xl text-gray-300 font-light">
              Craft Perfect Synthetic Datasets
            </p>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          {/* Input Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Generate Your Dataset</h2>
              </div>

              <div className="space-y-6">
                {/* Dataset Description */}
                <div className="space-y-3">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Dataset Description
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your perfect dataset..."
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-cyan-400 focus:bg-white/10 transition-all duration-300 placeholder-gray-400 text-white text-lg group-hover:border-white/20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        description.length > 0 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50' 
                          : 'bg-gray-500'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Row Count and Generate */}
                <div className="flex flex-col lg:flex-row gap-6 items-end">
                  <div className="flex-1 space-y-3">
                    <label htmlFor="rowCount" className="block text-sm font-semibold text-gray-200 uppercase tracking-wider">
                      Dataset Size
                    </label>
                    <div className="relative group">
                      <RowsIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                      <select
                        id="rowCount"
                        value={rowCount}
                        onChange={(e) => setRowCount(Number(e.target.value))}
                        className="w-full pl-14 pr-12 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl focus:border-cyan-400 focus:bg-white/10 transition-all duration-300 text-white text-lg appearance-none cursor-pointer group-hover:border-white/20"
                      >
                        <option value={10} className="bg-gray-800">10 rows</option>
                        <option value={20} className="bg-gray-800">20 rows</option>
                        <option value={30} className="bg-gray-800">30 rows</option>
                        <option value={40} className="bg-gray-800">40 rows</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none group-hover:text-cyan-400 transition-colors duration-300" />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !description.trim()}
                    className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-cyan-400 hover:to-purple-500 focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 disabled:hover:scale-100 min-w-[200px]"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Forging Data...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Generate</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-xl rounded-3xl border border-red-400/30 shadow-2xl mb-8 overflow-hidden animate-slideInUp">
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <h3 className="text-xl font-bold text-white">Error</h3>
                </div>
                <p className="text-red-200 mt-2">{error}</p>
              </div>
            </div>
          )}

          {/* Data Preview Section - Only visible after generation */}
          {hasGenerated && generatedData.length > 0 && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl mb-8 overflow-hidden animate-slideInUp">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h2 className="text-3xl font-bold text-white">Data Preview</h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      Showing first 5 rows
                    </span>
                    <button
                      onClick={resetGeneration}
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-200 underline"
                    >
                      Generate New
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-white/20 shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-purple-600/30 to-cyan-600/30 backdrop-blur-sm">
                        <tr>
                          {generatedData.length > 0 && Object.keys(generatedData[0]).map((header) => (
                            <th
                              key={header}
                              className="px-6 py-4 text-left text-sm font-bold text-gray-200 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white/5 backdrop-blur-sm divide-y divide-white/10">
                        {generatedData.slice(0, 5).map((row, index) => (
                          <tr
                            key={index}
                            className="hover:bg-white/10 transition-all duration-200 group"
                          >
                            {Object.values(row).map((value, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 group-hover:text-white transition-colors duration-200"
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Section - Only visible after generation */}
          {hasGenerated && csvData && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-3xl border border-emerald-400/30 shadow-2xl overflow-hidden animate-slideInUp animation-delay-300">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start space-x-2">
                      <Download className="w-6 h-6 text-emerald-400" />
                      <span>Ready for Download</span>
                    </h3>
                    <p className="text-gray-300">
                      Your synthetic dataset is ready • {rowCount} rows • CSV format
                    </p>
                  </div>
                  <button
                    onClick={downloadCSV}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-400 hover:to-teal-500 focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
                  >
                    <Download className="w-6 h-6" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!hasGenerated && (
          <div className="text-center mt-16">
            <p className="text-gray-400 text-lg">
              Transform your ideas into data • Powered by AI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;