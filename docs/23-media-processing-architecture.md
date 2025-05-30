# TanukiMCP Atlas Media Processing Architecture

## Overview

The Media Processing Architecture of TanukiMCP Atlas enables advanced multimedia understanding capabilities by integrating with OpenRouter LLMs and specialized Python libraries. This system processes various media types (images, documents, videos, audio) and extracts meaningful context that can be used by LLMs to provide enhanced, multimodal reasoning.

```
┌─────────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│                     │     │                    │     │                   │
│  Media Input        │────►│  Processing        │────►│  LLM Context      │
│  (Image/Video/etc)  │     │  Pipeline          │     │  Generation       │
│                     │     │                    │     │                   │
└─────────────────────┘     └────────────────────┘     └───────────────────┘
                                      │                          │
                                      ▼                          ▼
                            ┌────────────────────┐     ┌───────────────────┐
                            │                    │     │                   │
                            │  Result Cache      │     │  OpenRouter LLM   │
                            │  & Storage         │     │  Integration      │
                            │                    │     │                   │
                            └────────────────────┘     └───────────────────┘
```

## Core Components

### 1. Media Input Handler

Responsible for:
- Accepting various media types (images, PDFs, videos, audio)
- Validating file types and content
- Preprocessing media for efficient processing
- Handling large file streaming

### 2. OCR Processing Engine

Utilizes established Python libraries (Tesseract, Pytesseract) to:
- Extract text from images and scanned documents
- Perform layout analysis to understand document structure
- Support multiple languages
- Handle various text styles and formats

### 3. Image Analysis System

Leverages computer vision libraries to:
- Detect objects, people, and scenes
- Extract visual features and attributes
- Generate descriptive captions
- Identify text elements within images

### 4. Video Processing Pipeline

Processes video content by:
- Extracting key frames at appropriate intervals
- Performing scene segmentation
- Transcribing audio content
- Combining visual and audio analysis

### 5. Audio Processing

Handles audio input through:
- Speech-to-text transcription
- Speaker diarization (who said what)
- Audio event detection
- Language identification

### 6. Context Generation

Transforms processed media into LLM-compatible context by:
- Creating detailed textual descriptions
- Formatting extracted content for LLM consumption
- Prioritizing relevant information
- Maintaining references to original media

## Architecture Diagrams

### Media Processing Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │    │              │
│  Media       │───►│  Media Type  │───►│  Specific    │───►│  Context     │───►│  LLM         │
│  Upload      │    │  Detection   │    │  Processor   │    │  Generation  │    │  Integration │
│              │    │              │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                             │
                                             ├───────────────┬───────────────┐
                                             ▼               ▼               ▼
                                      ┌──────────────┐┌──────────────┐┌──────────────┐
                                      │              ││              ││              │
                                      │  OCR         ││  Computer    ││  Audio       │
                                      │  Engine      ││  Vision      ││  Processing  │
                                      │              ││              ││              │
                                      └──────────────┘└──────────────┘└──────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Media Processing Manager                         │
│                                                                         │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐  │
│  │             │   │             │   │             │   │             │  │
│  │  Image      │   │  Document   │   │  Video      │   │  Audio      │  │
│  │  Processor  │   │  Processor  │   │  Processor  │   │  Processor  │  │
│  │             │   │             │   │             │   │             │  │
│  └─────┬───────┘   └─────┬───────┘   └─────┬───────┘   └─────┬───────┘  │
│        │                 │                 │                 │          │
└────────┼─────────────────┼─────────────────┼─────────────────┼──────────┘
         │                 │                 │                 │
         ▼                 ▼                 ▼                 ▼
┌─────────────┐     ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│             │     │             │   │             │   │             │
│  Tesseract  │     │  PyPDF      │   │  OpenCV     │   │  Whisper    │
│  OCR        │     │  Library    │   │  Processing │   │  STT        │
│             │     │             │   │             │   │             │
└─────────────┘     └─────────────┘   └─────────────┘   └─────────────┘
```

## Implementation Details

### 1. Image Processing Module

```python
# Python implementation for image processing
import cv2
import numpy as np
import pytesseract
from PIL import Image

class ImageProcessor:
    def __init__(self, config=None):
        self.config = config or {}
        # Configure Tesseract
        self.tesseract_config = self.config.get('tesseract', {})
        pytesseract.pytesseract.tesseract_cmd = self.tesseract_config.get(
            'path', '/usr/bin/tesseract'
        )
        
    def extract_text(self, image_path):
        """Extract text from image using OCR"""
        try:
            img = Image.open(image_path)
            text = pytesseract.image_to_string(img)
            
            # Get additional data like layout and word positions
            data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
            
            return {
                'text': text,
                'layout': self._process_layout(data),
                'confidence': self._calculate_confidence(data)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_image(self, image_path):
        """Analyze image content using computer vision"""
        try:
            img = cv2.imread(image_path)
            
            # Basic image analysis
            analysis = {
                'dimensions': (img.shape[1], img.shape[0]),
                'channels': img.shape[2] if len(img.shape) > 2 else 1,
                'objects': self._detect_objects(img),
                'faces': self._detect_faces(img),
                'dominant_colors': self._extract_dominant_colors(img)
            }
            
            return analysis
        except Exception as e:
            return {'error': str(e)}
    
    def _detect_objects(self, img):
        """Detect objects in the image using YOLO or similar"""
        # Implementation would use a pre-trained model
        # This is a placeholder
        return []
    
    def _detect_faces(self, img):
        """Detect and analyze faces in the image"""
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        return [{'position': (x, y, w, h)} for (x, y, w, h) in faces]
    
    def _extract_dominant_colors(self, img):
        """Extract dominant colors from image"""
        # Resize image for faster processing
        small = cv2.resize(img, (100, 100))
        pixels = small.reshape((-1, 3))
        
        # Convert to float
        pixels = np.float32(pixels)
        
        # Define criteria
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        k = 5  # Number of colors to extract
        
        _, labels, centers = cv2.kmeans(
            pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS
        )
        
        # Convert back to uint8
        centers = np.uint8(centers)
        
        # Get color percentages
        unique, counts = np.unique(labels, return_counts=True)
        color_percentages = counts / counts.sum()
        
        # Convert BGR to RGB and to hex
        colors = []
        for i, center in enumerate(centers):
            bgr = center.tolist()
            rgb = [bgr[2], bgr[1], bgr[0]]  # Convert BGR to RGB
            hex_color = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
            colors.append({
                'color': hex_color,
                'percentage': float(color_percentages[i])
            })
            
        return colors
    
    def _process_layout(self, ocr_data):
        """Process OCR data to extract layout information"""
        # Group text by lines and paragraphs
        lines = {}
        for i, word in enumerate(ocr_data['text']):
            if ocr_data['conf'][i] < 0:  # Skip low confidence items
                continue
                
            line_num = ocr_data['line_num'][i]
            if line_num not in lines:
                lines[line_num] = {
                    'text': word,
                    'bbox': [
                        ocr_data['left'][i],
                        ocr_data['top'][i],
                        ocr_data['width'][i],
                        ocr_data['height'][i]
                    ]
                }
            else:
                lines[line_num]['text'] += ' ' + word
                
        return list(lines.values())
    
    def _calculate_confidence(self, ocr_data):
        """Calculate overall OCR confidence"""
        valid_confidences = [conf for conf in ocr_data['conf'] if conf > 0]
        if not valid_confidences:
            return 0
        return sum(valid_confidences) / len(valid_confidences)
```

### 2. Document Processing Module

```python
# Python implementation for document processing
import PyPDF2
import io
from PIL import Image
import pytesseract
import fitz  # PyMuPDF

class DocumentProcessor:
    def __init__(self, config=None):
        self.config = config or {}
        self.image_processor = ImageProcessor(config)
        
    def process_pdf(self, pdf_path):
        """Process PDF document to extract text and images"""
        result = {
            'text': [],
            'images': [],
            'metadata': {},
            'pages': 0
        }
        
        try:
            # Extract text and metadata using PyPDF2
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                result['pages'] = len(reader.pages)
                result['metadata'] = reader.metadata or {}
                
                # Extract text from each page
                for i, page in enumerate(reader.pages):
                    text = page.extract_text()
                    result['text'].append({
                        'page': i + 1,
                        'content': text
                    })
            
            # Extract images using PyMuPDF
            doc = fitz.open(pdf_path)
            image_count = 0
            
            for i, page in enumerate(doc):
                image_list = page.get_images(full=True)
                
                for img_index, img_info in enumerate(image_list):
                    img_index += 1
                    xref = img_info[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    
                    # Save image temporarily
                    temp_img = io.BytesIO(image_bytes)
                    image = Image.open(temp_img)
                    
                    # Extract text from image if it exists
                    try:
                        img_text = pytesseract.image_to_string(image)
                    except:
                        img_text = ""
                    
                    # Store image info
                    result['images'].append({
                        'page': i + 1,
                        'index': img_index,
                        'width': base_image['width'],
                        'height': base_image['height'],
                        'text_content': img_text
                    })
                    
                    image_count += 1
            
            return result
            
        except Exception as e:
            return {'error': str(e)}
    
    def process_scanned_document(self, image_path):
        """Process scanned document using OCR"""
        return self.image_processor.extract_text(image_path)
```

### 3. Video Processing Module

```python
# Python implementation for video processing
import cv2
import numpy as np
import os
import tempfile
import whisper

class VideoProcessor:
    def __init__(self, config=None):
        self.config = config or {}
        self.image_processor = ImageProcessor(config)
        self.audio_processor = AudioProcessor(config)
        self.frame_interval = self.config.get('frame_interval', 1)  # seconds
        
    def process_video(self, video_path):
        """Process video to extract frames, audio, and analyze content"""
        result = {
            'metadata': {},
            'keyframes': [],
            'transcript': '',
            'scenes': []
        }
        
        try:
            # Open video file
            cap = cv2.VideoCapture(video_path)
            
            # Extract metadata
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count / fps
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            result['metadata'] = {
                'fps': fps,
                'frame_count': frame_count,
                'duration': duration,
                'width': width,
                'height': height
            }
            
            # Extract keyframes
            frame_interval_frames = int(fps * self.frame_interval)
            
            curr_frame = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                    
                # Save keyframes at regular intervals
                if curr_frame % frame_interval_frames == 0:
                    # Save frame to temporary file
                    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
                        temp_filename = tmp.name
                        cv2.imwrite(temp_filename, frame)
                        
                        # Analyze frame
                        frame_analysis = self.image_processor.analyze_image(temp_filename)
                        frame_text = self.image_processor.extract_text(temp_filename)
                        
                        # Add to result
                        result['keyframes'].append({
                            'timestamp': curr_frame / fps,
                            'frame_number': curr_frame,
                            'analysis': frame_analysis,
                            'text': frame_text.get('text', '')
                        })
                        
                        # Remove temporary file
                        os.unlink(temp_filename)
                
                curr_frame += 1
            
            # Extract audio and transcribe
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
                audio_file = tmp.name
                
                # Use ffmpeg to extract audio
                os.system(f"ffmpeg -i {video_path} -q:a 0 -map a {audio_file}")
                
                # Transcribe audio
                transcript = self.audio_processor.transcribe(audio_file)
                result['transcript'] = transcript
                
                # Remove temporary file
                os.unlink(audio_file)
            
            # Detect scene changes
            result['scenes'] = self._detect_scenes(video_path)
            
            return result
            
        except Exception as e:
            return {'error': str(e)}
        finally:
            if 'cap' in locals():
                cap.release()
    
    def _detect_scenes(self, video_path):
        """Detect scene changes in video"""
        scenes = []
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Read first frame
        ret, prev_frame = cap.read()
        if not ret:
            return scenes
            
        prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
        curr_frame = 1
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert to grayscale
            curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Calculate difference
            diff = cv2.absdiff(prev_gray, curr_gray)
            
            # Calculate non-zero pixels
            non_zero_count = np.count_nonzero(diff)
            
            # If difference is significant, mark as scene change
            threshold = prev_gray.size * 0.10  # 10% change threshold
            if non_zero_count > threshold:
                scenes.append({
                    'timestamp': curr_frame / fps,
                    'frame_number': curr_frame
                })
            
            prev_gray = curr_gray
            curr_frame += 1
        
        cap.release()
        return scenes
```

### 4. Audio Processing Module

```python
# Python implementation for audio processing
import whisper
import librosa
import numpy as np

class AudioProcessor:
    def __init__(self, config=None):
        self.config = config or {}
        self.model_size = self.config.get('whisper_model', 'base')
        self.model = None  # Lazy load
        
    def _load_model(self):
        """Load Whisper model if not already loaded"""
        if self.model is None:
            self.model = whisper.load_model(self.model_size)
        return self.model
    
    def transcribe(self, audio_path):
        """Transcribe audio file to text"""
        try:
            model = self._load_model()
            result = model.transcribe(audio_path)
            return result['text']
        except Exception as e:
            return {'error': str(e)}
    
    def process_audio(self, audio_path):
        """Process audio file for comprehensive analysis"""
        try:
            # Load audio file
            y, sr = librosa.load(audio_path, sr=None)
            
            # Basic audio analysis
            duration = librosa.get_duration(y=y, sr=sr)
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            
            # Transcribe audio
            transcription = self.transcribe(audio_path)
            
            # Analyze audio characteristics
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfcc_mean = np.mean(mfccs, axis=1).tolist()
            
            # Detect speech segments
            speech_segments = self._detect_speech_segments(y, sr)
            
            return {
                'duration': duration,
                'sample_rate': sr,
                'tempo': tempo,
                'transcription': transcription,
                'audio_features': {
                    'mfcc_mean': mfcc_mean
                },
                'speech_segments': speech_segments
            }
        except Exception as e:
            return {'error': str(e)}
    
    def _detect_speech_segments(self, y, sr):
        """Detect speech segments in audio"""
        # This is a simplified implementation
        # Real implementation would use more sophisticated methods
        
        # Calculate energy
        energy = librosa.feature.rms(y=y)[0]
        
        # Find segments with energy above threshold
        threshold = np.mean(energy) * 0.5
        speech = energy > threshold
        
        # Convert to timestamps
        frame_length = 2048
        hop_length = 512
        
        segments = []
        in_segment = False
        start_frame = 0
        
        for i, is_speech in enumerate(speech):
            frame_time = librosa.frames_to_time(i, sr=sr, hop_length=hop_length)
            
            if is_speech and not in_segment:
                in_segment = True
                start_frame = i
            elif not is_speech and in_segment:
                in_segment = False
                end_frame = i - 1
                segments.append({
                    'start': librosa.frames_to_time(start_frame, sr=sr, hop_length=hop_length),
                    'end': librosa.frames_to_time(end_frame, sr=sr, hop_length=hop_length)
                })
                
        # Handle case where audio ends during speech
        if in_segment:
            segments.append({
                'start': librosa.frames_to_time(start_frame, sr=sr, hop_length=hop_length),
                'end': librosa.get_duration(y=y, sr=sr)
            })
            
        return segments
```

### 5. Context Generation Module

```typescript
// TypeScript implementation for context generation
class ContextGenerator {
  private maxContextLength: number;
  
  constructor(config: ContextGeneratorConfig = {}) {
    this.maxContextLength = config.maxContextLength || 4000;
  }
  
  generateImageContext(imageAnalysis: ImageAnalysisResult): string {
    // Generate context for image analysis
    const parts: string[] = [];
    
    // Add image dimensions
    if (imageAnalysis.dimensions) {
      parts.push(`Image dimensions: ${imageAnalysis.dimensions[0]}x${imageAnalysis.dimensions[1]} pixels.`);
    }
    
    // Add detected objects
    if (imageAnalysis.objects && imageAnalysis.objects.length > 0) {
      const objectsDesc = imageAnalysis.objects
        .map(obj => `${obj.name} (confidence: ${(obj.confidence * 100).toFixed(1)}%)`)
        .join(', ');
      parts.push(`Objects detected: ${objectsDesc}.`);
    } else {
      parts.push('No objects were detected in this image.');
    }
    
    // Add faces
    if (imageAnalysis.faces && imageAnalysis.faces.length > 0) {
      parts.push(`Detected ${imageAnalysis.faces.length} face(s) in the image.`);
    }
    
    // Add colors
    if (imageAnalysis.dominant_colors && imageAnalysis.dominant_colors.length > 0) {
      const colorDesc = imageAnalysis.dominant_colors
        .slice(0, 3)
        .map(c => `${c.color} (${(c.percentage * 100).toFixed(1)}%)`)
        .join(', ');
      parts.push(`Dominant colors: ${colorDesc}.`);
    }
    
    // Add extracted text
    if (imageAnalysis.text && imageAnalysis.text.trim()) {
      parts.push(`Text found in image: "${imageAnalysis.text.trim()}"`);
    }
    
    return parts.join('\n');
  }
  
  generateDocumentContext(docAnalysis: DocumentAnalysisResult): string {
    // Generate context for document analysis
    const parts: string[] = [];
    
    // Add metadata
    if (docAnalysis.metadata) {
      const meta = docAnalysis.metadata;
      parts.push(`Document type: PDF with ${docAnalysis.pages} pages.`);
      
      if (meta.title) parts.push(`Title: ${meta.title}`);
      if (meta.author) parts.push(`Author: ${meta.author}`);
      if (meta.creation_date) parts.push(`Created: ${meta.creation_date}`);
    }
    
    // Add text content (truncated if needed)
    if (docAnalysis.text && docAnalysis.text.length > 0) {
      const textContent = docAnalysis.text
        .map(page => `Page ${page.page}: ${this.truncateText(page.content, 500)}`)
        .join('\n\n');
      
      parts.push(`Document content:\n${textContent}`);
    }
    
    // Add image information
    if (docAnalysis.images && docAnalysis.images.length > 0) {
      parts.push(`The document contains ${docAnalysis.images.length} images.`);
      
      // Add text from images if available
      const imagesWithText = docAnalysis.images.filter(img => img.text_content && img.text_content.trim());
      if (imagesWithText.length > 0) {
        const imageTextSample = imagesWithText
          .slice(0, 3)
          .map(img => `Image on page ${img.page}: "${this.truncateText(img.text_content, 100)}"`)
          .join('\n');
        
        parts.push(`Text found in images:\n${imageTextSample}`);
      }
    }
    
    return this.truncateText(parts.join('\n\n'), this.maxContextLength);
  }
  
  generateVideoContext(videoAnalysis: VideoAnalysisResult): string {
    // Generate context for video analysis
    const parts: string[] = [];
    
    // Add metadata
    if (videoAnalysis.metadata) {
      const meta = videoAnalysis.metadata;
      const duration = this.formatDuration(meta.duration);
      parts.push(`Video: ${meta.width}x${meta.height}, ${duration}, ${meta.fps.toFixed(2)} FPS.`);
    }
    
    // Add transcript summary
    if (videoAnalysis.transcript) {
      parts.push(`Transcript: "${this.truncateText(videoAnalysis.transcript, 1000)}"`);
    }
    
    // Add scene information
    if (videoAnalysis.scenes && videoAnalysis.scenes.length > 0) {
      parts.push(`The video contains ${videoAnalysis.scenes.length} scenes.`);
      
      // Add sample of scene transitions
      const scenesSample = videoAnalysis.scenes
        .slice(0, 5)
        .map(scene => `Scene at ${this.formatTimestamp(scene.timestamp)}`)
        .join(', ');
      
      parts.push(`Scene transitions: ${scenesSample}${videoAnalysis.scenes.length > 5 ? '...' : ''}`);
    }
    
    // Add keyframe analysis
    if (videoAnalysis.keyframes && videoAnalysis.keyframes.length > 0) {
      parts.push(`Analyzed ${videoAnalysis.keyframes.length} keyframes.`);
      
      // Add sample of keyframe content
      const keyframeSample = videoAnalysis.keyframes
        .slice(0, 3)
        .map(frame => {
          const timestamp = this.formatTimestamp(frame.timestamp);
          const objects = frame.analysis?.objects?.length ? 
            `Objects: ${frame.analysis.objects.map(o => o.name).join(', ')}. ` : '';
          const text = frame.text ? `Text: "${this.truncateText(frame.text, 100)}"` : '';
          
          return `[${timestamp}] ${objects}${text}`;
        })
        .join('\n');
      
      parts.push(`Keyframe analysis:\n${keyframeSample}`);
    }
    
    return this.truncateText(parts.join('\n\n'), this.maxContextLength);
  }
  
  generateAudioContext(audioAnalysis: AudioAnalysisResult): string {
    // Generate context for audio analysis
    const parts: string[] = [];
    
    // Add basic info
    const duration = this.formatDuration(audioAnalysis.duration);
    parts.push(`Audio file: ${duration}, ${audioAnalysis.sample_rate} Hz.`);
    
    if (audioAnalysis.tempo) {
      parts.push(`Tempo: approximately ${Math.round(audioAnalysis.tempo)} BPM.`);
    }
    
    // Add transcription
    if (typeof audioAnalysis.transcription === 'string' && audioAnalysis.transcription.trim()) {
      parts.push(`Transcription: "${this.truncateText(audioAnalysis.transcription.trim(), 1000)}"`);
    }
    
    // Add speech segments
    if (audioAnalysis.speech_segments && audioAnalysis.speech_segments.length > 0) {
      parts.push(`Detected ${audioAnalysis.speech_segments.length} speech segments.`);
      
      // Show first few segments
      if (audioAnalysis.speech_segments.length <= 5) {
        const segmentsList = audioAnalysis.speech_segments
          .map(seg => `${this.formatTimestamp(seg.start)} - ${this.formatTimestamp(seg.end)}`)
          .join(', ');
        
        parts.push(`Speech segments: ${segmentsList}`);
      }
    }
    
    return this.truncateText(parts.join('\n\n'), this.maxContextLength);
  }
  
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes < 1) {
      return `${remainingSeconds} seconds`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }
  
  private formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
```

## Integration with OpenRouter

The Media Processing system integrates with OpenRouter LLMs through a consistent workflow:

1. **Media Upload**: User uploads media file through the UI or captures with mobile device
2. **Pre-processing**: The file is validated and prepared for processing
3. **Media Analysis**: The appropriate processor is selected based on file type
4. **Context Generation**: Media analysis results are converted to LLM-compatible context
5. **LLM Enhancement**: The generated context is provided to OpenRouter LLMs
6. **Response Generation**: LLM generates enhanced responses with media awareness

The integration uses a specialized prompt format that embeds media context:

```typescript
// Example OpenRouter integration
async function processMediaForLLM(
  mediaFile: File, 
  userMessage: string
): Promise<string> {
  // Process media based on type
  const mediaContext = await processMedia(mediaFile);
  
  // Construct prompt with media context
  const prompt = `
User has shared ${mediaFile.type} and asked: "${userMessage}"

Media analysis:
${mediaContext}

Based on this media and the user's question, provide a helpful response.
`;

  // Send to OpenRouter
  const response = await openRouterClient.chat({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3.2:3b',
    max_tokens: 1024
  });
  
  return response.choices[0].message.content;
}
```

## Mobile-Desktop Proxy Media Processing Flow

When using the Mobile-Desktop Proxy architecture, media processing follows this flow:

1. **Mobile Capture**: User captures or selects media on mobile device
2. **Upload to Desktop**: Media is transferred to desktop over WebSocket connection
3. **Desktop Processing**: Full media processing performed on desktop hardware
4. **Context Generation**: Processed results converted to LLM context
5. **OpenRouter Integration**: Desktop sends context to OpenRouter
6. **Response Streaming**: Results streamed back to mobile client

This approach leverages desktop's processing power while maintaining responsive mobile experience.

## Security and Privacy

The Media Processing architecture incorporates these security measures:

1. **Data Handling**: Media files are processed locally without sending to third-party services
2. **Temporary Storage**: Files are processed in-memory or using temporary storage
3. **Access Control**: Strict permissions for file access
4. **Content Scanning**: Files scanned for malware before processing
5. **Metadata Scrubbing**: Personally identifiable information removed from metadata

## Performance Optimizations

The system includes these optimizations:

1. **Progressive Processing**: Initial results returned quickly, with deeper analysis following
2. **Caching**: Results cached to avoid redundant processing
3. **Resolution Scaling**: Images and videos processed at appropriate resolutions
4. **Worker Threads**: Processing performed in separate threads to maintain UI responsiveness
5. **Resource Limits**: Automatic adjustment based on system capabilities

## Conclusion

The TanukiMCP Atlas Media Processing Architecture creates a powerful multimodal experience by integrating specialized media processing with OpenRouter LLMs. This allows for richer interactions with various media types while maintaining performance and security. The architecture's modular design facilitates future extensions to support additional media types and processing techniques. 