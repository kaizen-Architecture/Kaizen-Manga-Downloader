import sys
import zipfile
import tempfile
import shutil
import os

def inject_metadata(zip_path, xml_content_path):
    try:
        with open(xml_content_path, 'r', encoding='utf-8') as f:
            xml_content = f.read()
    except Exception as e:
        print(f"Error reading XML content: {e}", file=sys.stderr)
        sys.exit(1)

    temp_fd, temp_path = tempfile.mkstemp()
    os.close(temp_fd)
    try:
        with zipfile.ZipFile(zip_path, 'r') as zin:
            with zipfile.ZipFile(temp_path, 'w', zipfile.ZIP_DEFLATED) as zout:
                for item in zin.infolist():
                    if item.filename != 'ComicInfo.xml':
                        zout.writestr(item, zin.read(item.filename))
                zout.writestr('ComicInfo.xml', xml_content)
        shutil.move(temp_path, zip_path)
        print("Success")
    except Exception as e:
        print(f"Error during zip injection: {e}", file=sys.stderr)
        if os.path.exists(temp_path):
            os.remove(temp_path)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 kavita_inject.py <zip_path> <xml_content_path>", file=sys.stderr)
        sys.exit(1)
    inject_metadata(sys.argv[1], sys.argv[2])
