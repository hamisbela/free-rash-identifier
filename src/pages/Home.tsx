import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Stethoscope, Loader2, AlertTriangle } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default rash image path
const DEFAULT_IMAGE = "/images/rash-default.avif";

// Default analysis for the rash
const DEFAULT_ANALYSIS = `1. Preliminary Assessment:
- Appearance: Red, raised bumps
- Distribution: Clustered pattern
- Affected Area: Skin surface
- Notable Features: Mild inflammation
- Possible Type: Common skin rash

2. Characteristics:
- Color: Reddish
- Texture: Slightly raised
- Pattern: Grouped lesions
- Size: Small to medium bumps
- Associated Signs: Mild swelling

3. Common Triggers & Factors:
- Environmental: Various allergens
- Physical: Friction or pressure
- Temperature: Heat or cold exposure
- Time Pattern: Can vary
- Aggravating Factors: Various

4. General Information:
- Common Occurrence: Frequently seen
- Age Groups: Can affect any age
- Duration: Variable
- Similar Conditions: Multiple possibilities
- Educational Notes: Common skin reaction

5. Important Notice:
- This is an educational analysis only
- Not a medical diagnosis
- Consult healthcare provider
- Seek immediate care if severe
- Individual cases may vary`;

function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const rashPrompt = "Analyze this skin condition image for educational purposes and provide the following information:\n1. Preliminary assessment (appearance, distribution, affected area)\n2. Characteristics (color, texture, pattern)\n3. Common triggers & factors\n4. General information\n5. Important notices and precautions\n\nIMPORTANT: Emphasize that this is for educational purposes only and should never replace professional medical advice.";
    try {
      const result = await analyzeImage(imageData, rashPrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Free Rash Identifier</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload a photo of a skin condition for educational information and analysis</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-800 font-semibold">⚠️ Important Medical Disclaimer</h3>
              <p className="text-red-700 mt-1">
                This tool is for educational purposes only and should not replace professional medical advice.
                If you're experiencing severe symptoms, spreading rash, fever, or other concerning symptoms,
                please seek immediate medical attention.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Skin Photo
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG or JPEG (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Skin condition preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="-ml-1 mr-2 h-5 w-5" />
                      Analyze Rash
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Photo
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Skin Condition Analysis</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
              <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-red-800 font-semibold">⚠️ Important Medical Disclaimer</h3>
                    <p className="text-red-700 mt-1">
                      This analysis is for educational purposes only and should not be used for self-diagnosis
                      or treatment decisions. Always consult with qualified healthcare professionals for proper
                      diagnosis and treatment of skin conditions. If you're experiencing severe symptoms,
                      spreading rash, fever, or other concerning symptoms, please seek immediate medical attention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Free Rash Identifier: Your Educational Guide to Skin Conditions</h2>
          
          <p>Welcome to our free rash identifier tool, powered by advanced artificial intelligence technology.
             This educational tool helps you learn about different skin conditions, their characteristics,
             and important health information.</p>

          <div className="bg-red-50 p-6 rounded-lg my-8">
            <h3 className="text-red-800">⚠️ Critical Medical Notice</h3>
            <p className="text-red-700">This tool is strictly for educational purposes. Never rely solely on
            digital identification for medical decisions. Always consult healthcare professionals for proper
            diagnosis and treatment of skin conditions. If you're experiencing severe symptoms, spreading rash,
            fever, or other concerning symptoms, seek immediate medical attention.</p>
          </div>

          <h3>How Our Educational Rash Identifier Works</h3>
          <p>Our tool uses AI to analyze photos of skin conditions and provide educational information about
             their characteristics, common triggers, and general information. Simply upload a clear photo
             of the affected area, and our AI will help you learn about it.</p>

          <h3>Key Features of Our Rash Identifier</h3>
          <ul>
            <li>Educational skin condition information</li>
            <li>Detailed characteristic analysis</li>
            <li>Common triggers and factors</li>
            <li>Important health notices</li>
            <li>When to seek medical care</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For Learning About:</h3>
          <ul>
            <li>Common skin conditions</li>
            <li>Rash characteristics</li>
            <li>Potential triggers</li>
            <li>General skin health</li>
            <li>When to see a doctor</li>
          </ul>

          <p>Try our free rash identifier today and learn more about skin health! No registration
             required - just upload a photo and start learning about common skin conditions.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}

export default Home;