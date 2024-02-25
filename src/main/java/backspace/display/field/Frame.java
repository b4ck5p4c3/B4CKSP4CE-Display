package backspace.display.field;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;

@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Frame implements Identifiable, Cloneable {

    private String id;

    private String name;

    private String description;

    private byte[][] pixelsBrightnesses;

    public Frame(int width, int height) {
        this(createField(width, height));
    }

    public Frame(byte[][] pointsBrightnesses) {
        this.pixelsBrightnesses = pointsBrightnesses;
    }

    public Frame(String name, String description, int width, int height) {
        this(width, height);
        this.name = name;
        this.description = description;
    }

    public Frame(String name, String description, byte[][] frameBytes) {
        this(frameBytes);
        this.name = name;
        this.description = description;
    }


    public void setPixelBrightness(Point point, byte brightness) {
        if (point.x < 0 || point.x >= width() || point.y < 0 || point.y >= height()) {
            throw new IllegalArgumentException("Point is out of field");
        }
        pixelsBrightnesses[point.y][point.x] = brightness;
    }

    public byte getPixelBrightness(Point point) {
        return getPixelBrightness(point.x, point.y);
    }

    public byte getPixelBrightness(int x, int y) {
        if (x < 0 || x >= width() || y < 0 || y >= height()) {
            throw new IllegalArgumentException("Point X=%d, Y=%d is out of field. width: %d, height: %d"
                    .formatted(x, y, width(), height()));
        }
        return pixelsBrightnesses[y][x];
    }

    public void crop(int width, int height) {
        if (width < 0 || height < 0) {
            throw new IllegalArgumentException("Size of field must be positive");
        }

        byte[][] newField = new byte[height][width];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                if (x < width() && y < height()) {
                    newField[y][x] = pixelsBrightnesses[y][x];
                } else {
                    newField[y][x] = 0;
                }
            }
        }
        pixelsBrightnesses = newField;
    }

    private static byte[][] createField(int width, int height, byte brightness) {
        if (width <= 0 || height <= 0) {
            throw new IllegalArgumentException("Size of field must be positive");
        }
        return new byte[width][height];
    }

    private static byte[][] createField(int width, int height) {
        return createField(width, height, (byte) 0);
    }

    private String fieldToString() {
        StringBuffer sb = new StringBuffer();
        for (int y = 0; y < height(); y++) {
            for (int x = 0; x < width(); x++) {
                sb.append(getPixelBrightness(x, y) == 0 ? "0 " : "X ");
            }
            sb.append("\n");
        }
        sb.append("\n");
        return sb.toString();
    }

    @Override
    public Frame clone() {
        Frame frame = new Frame(name, description, cloneField(pixelsBrightnesses));
        frame.setId(id);
        return frame;
    }

    private byte[][] cloneField(byte[][] field) {
        byte[][] newField = new byte[field.length][];
        for (int i = 0; i < field.length; i++) {
            newField[i] = field[i].clone();
        }
        return newField;
    }

    @Override
    public String toString() {
        return "Frame{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", height=" + height() +
                ", width=" + width() +
                '}';

    }

    public void print() {
        System.out.println(fieldToString());
    }


    public int width() {
        return pixelsBrightnesses[0].length;
    }

    public int height() {
        return pixelsBrightnesses.length;
    }

}
